const SHEET_NAME = 'Registrations';
const GROUP_CODES_SHEET_NAME = 'Group Codes';
const SCRIPT_PROPERTY_SPREADSHEET_ID = 'SPREADSHEET_ID';
const SCRIPT_PROPERTY_WEBHOOK_SECRET = 'WEBHOOK_SECRET';
const GROUP_CODE_HEADERS = [
  'Code',
  'Group Name',
  'Discount CAD',
  'Max Uses',
  'Used',
  'Active',
  'Notes',
  'Last Used At',
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const expectedSecret = PropertiesService.getScriptProperties().getProperty(SCRIPT_PROPERTY_WEBHOOK_SECRET);

    if (!expectedSecret || body.secret !== expectedSecret) {
      return jsonResponse_({ ok: false, message: 'Unauthorized' });
    }

    const spreadsheetId = PropertiesService.getScriptProperties().getProperty(SCRIPT_PROPERTY_SPREADSHEET_ID);
    const spreadsheet = spreadsheetId
      ? SpreadsheetApp.openById(spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();
    const action = body.action || 'appendRegistration';
    const headers = Array.isArray(body.headers) ? body.headers : [];
    const row = Array.isArray(body.row) ? body.row : [];
    const lock = LockService.getScriptLock();

    lock.waitLock(10000);

    try {
      if (action === 'updatePaymentLink') {
        ensureHeaderRow_(getOrCreateSheet_(spreadsheet, SHEET_NAME), headers);
        return jsonResponse_(updatePaymentLink_(spreadsheet, body.update || {}));
      }

      if (action === 'markSquarePayment') {
        ensureHeaderRow_(getOrCreateSheet_(spreadsheet, SHEET_NAME), headers);
        return jsonResponse_(markSquarePayment_(spreadsheet, body.update || {}));
      }

      const groupCodeResult = applyGroupRegistrationCode_(spreadsheet, headers, row);
      if (!groupCodeResult.ok) {
        return jsonResponse_(groupCodeResult);
      }

      const sheet = getOrCreateSheet_(spreadsheet, SHEET_NAME);
      const sheetHeaders = ensureHeaderRow_(sheet, headers);
      sheet.appendRow(alignRowToHeaders_(headers, row, sheetHeaders));
      formatRegistrationSheet_(sheet, sheetHeaders);

      return jsonResponse_({
        ok: true,
        spreadsheetUrl: spreadsheet.getUrl(),
        sheetName: sheet.getName(),
        appendedRow: sheet.getLastRow(),
        discountCad: groupCodeResult.discountCad || 0,
        finalAmountCad: getNumberCellValue_(row, headers, 'Final Amount CAD'),
      });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return jsonResponse_({ ok: false, message: String(error) });
  }
}

function getOrCreateSheet_(spreadsheet, sheetName) {
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function ensureHeaderRow_(sheet, headers) {
  if (!headers.length) return getSheetHeaders_(sheet);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    return headers.slice();
  }

  const columnCount = Math.max(sheet.getLastColumn(), headers.length);
  const currentHeaders = sheet.getRange(1, 1, 1, columnCount).getValues()[0];
  const hasHeaders = currentHeaders.some((value) => value);

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    return headers.slice();
  }

  const mergedHeaders = currentHeaders.filter((header) => header);
  headers.forEach((header) => {
    if (!mergedHeaders.includes(header)) mergedHeaders.push(header);
  });
  sheet.getRange(1, 1, 1, mergedHeaders.length).setValues([mergedHeaders]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, mergedHeaders.length).setFontWeight('bold');
  return mergedHeaders;
}

function applyGroupRegistrationCode_(spreadsheet, headers, row) {
  const codeIndex = headers.indexOf('Group Registration Code');
  if (codeIndex === -1) {
    return { ok: true, discountCad: 0 };
  }

  const requestedCode = String(row[codeIndex] || '').trim().toUpperCase();
  if (!requestedCode) {
    return { ok: true, discountCad: 0 };
  }

  row[codeIndex] = requestedCode;

  const codeSheet = getOrCreateSheet_(spreadsheet, GROUP_CODES_SHEET_NAME);
  ensureHeaderRow_(codeSheet, GROUP_CODE_HEADERS);

  if (codeSheet.getLastRow() < 2) {
    return {
      ok: false,
      code: 'group_registration_code_not_found',
      message: 'Group registration code was not found.',
    };
  }

  const values = codeSheet
    .getRange(2, 1, codeSheet.getLastRow() - 1, GROUP_CODE_HEADERS.length)
    .getValues();

  for (let index = 0; index < values.length; index += 1) {
    const currentRow = values[index];
    const storedCode = String(currentRow[0] || '').trim().toUpperCase();
    if (storedCode !== requestedCode) continue;

    const isActive = normalizeActive_(currentRow[5]);
    if (!isActive) {
      return {
        ok: false,
        code: 'group_registration_code_inactive',
        message: 'Group registration code is not active.',
      };
    }

    const maxUses = normalizeNumber_(currentRow[3], 0);
    const used = normalizeNumber_(currentRow[4], 0);

    if (maxUses > 0 && used >= maxUses) {
      return {
        ok: false,
        code: 'group_registration_code_exhausted',
        message: 'Group registration code has already been fully used.',
      };
    }

    const discountCad = Math.max(0, normalizeNumber_(currentRow[2], 0));
    const baseFeeCad = getNumberCellValue_(row, headers, 'Base Fee CAD');
    const finalAmountCad = Math.max(baseFeeCad - discountCad, 0);
    const codeSheetRow = index + 2;

    setNumberCellValue_(row, headers, 'Discount CAD', discountCad);
    setNumberCellValue_(row, headers, 'Final Amount CAD', finalAmountCad);
    codeSheet.getRange(codeSheetRow, 5).setValue(used + 1);
    codeSheet.getRange(codeSheetRow, 8).setValue(new Date().toISOString());

    return {
      ok: true,
      discountCad,
      finalAmountCad,
      groupRegistrationCode: requestedCode,
      groupName: String(currentRow[1] || '').trim(),
    };
  }

  return {
    ok: false,
    code: 'group_registration_code_not_found',
    message: 'Group registration code was not found.',
  };
}

function updatePaymentLink_(spreadsheet, update) {
  const sheet = getOrCreateSheet_(spreadsheet, SHEET_NAME);
  const headers = getSheetHeaders_(sheet);
  const registrationId = String(update.registrationId || '').trim();

  if (!registrationId) {
    return {
      ok: false,
      code: 'missing_registration_id',
      message: 'Registration ID is required to update payment link.',
    };
  }

  const rowNumber = findRowByHeaderValue_(sheet, headers, 'Registration ID', registrationId);
  if (!rowNumber) {
    return {
      ok: false,
      code: 'registration_not_found',
      message: 'Registration was not found in the sheet.',
    };
  }

  setCellValueByHeader_(sheet, headers, rowNumber, 'Payment Status', update.paymentStatus || 'checkout_link_created');
  setCellValueByHeader_(sheet, headers, rowNumber, 'Payment Method', update.paymentMethod || 'Square Checkout');
  setCellValueByHeader_(sheet, headers, rowNumber, 'Final Amount CAD', update.finalAmountCad);
  setCellValueByHeader_(sheet, headers, rowNumber, 'Square Checkout URL', update.squareCheckoutUrl || '');
  setCellValueByHeader_(sheet, headers, rowNumber, 'Square Payment Link ID', update.squarePaymentLinkId || '');
  setCellValueByHeader_(sheet, headers, rowNumber, 'Square Order ID', update.squareOrderId || '');
  formatRegistrationSheet_(sheet, headers);

  return {
    ok: true,
    registrationId,
    updatedRow: rowNumber,
  };
}

function markSquarePayment_(spreadsheet, update) {
  const sheet = getOrCreateSheet_(spreadsheet, SHEET_NAME);
  const headers = getSheetHeaders_(sheet);
  const squareOrderId = String(update.squareOrderId || '').trim();

  if (!squareOrderId) {
    return {
      ok: false,
      code: 'missing_square_order_id',
      message: 'Square order ID is required to update payment status.',
    };
  }

  const rowNumber = findRowByHeaderValue_(sheet, headers, 'Square Order ID', squareOrderId);
  if (!rowNumber) {
    return {
      ok: false,
      code: 'square_order_not_found',
      message: 'Square order was not found in the registration sheet.',
    };
  }

  setCellValueByHeader_(sheet, headers, rowNumber, 'Payment Status', update.paymentStatus || 'square_payment_updated');
  setCellValueByHeader_(sheet, headers, rowNumber, 'Square Payment ID', update.squarePaymentId || '');
  setCellValueByHeader_(sheet, headers, rowNumber, 'Square Receipt URL', update.squareReceiptUrl || '');
  if (update.paidAt) {
    setCellValueByHeader_(sheet, headers, rowNumber, 'Paid At', update.paidAt);
  }
  formatRegistrationSheet_(sheet, headers);

  return {
    ok: true,
    squareOrderId,
    updatedRow: rowNumber,
  };
}

function getSheetHeaders_(sheet) {
  if (sheet.getLastColumn() === 0) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function findRowByHeaderValue_(sheet, headers, header, value) {
  const columnIndex = headers.indexOf(header) + 1;
  if (!columnIndex || sheet.getLastRow() < 2) return 0;

  const values = sheet.getRange(2, columnIndex, sheet.getLastRow() - 1, 1).getValues();
  for (let index = 0; index < values.length; index += 1) {
    if (String(values[index][0] || '').trim() === value) {
      return index + 2;
    }
  }

  return 0;
}

function setCellValueByHeader_(sheet, headers, rowNumber, header, value) {
  const columnIndex = headers.indexOf(header) + 1;
  if (!columnIndex) return;
  sheet.getRange(rowNumber, columnIndex).setValue(value === undefined ? '' : value);
}

function alignRowToHeaders_(sourceHeaders, row, targetHeaders) {
  const valuesByHeader = {};
  sourceHeaders.forEach(function(header, index) {
    valuesByHeader[header] = row[index];
  });
  return targetHeaders.map(function(header) {
    return valuesByHeader[header] === undefined ? '' : valuesByHeader[header];
  });
}

function formatRegistrationSheet_(sheet, headers) {
  const lastColumn = Math.max(sheet.getLastColumn(), headers.length, 1);
  const lastRow = Math.max(sheet.getLastRow(), 1);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(Math.min(5, lastColumn));
  sheet.getRange(1, 1, 1, lastColumn)
    .setFontWeight('bold')
    .setBackground('#24283d')
    .setFontColor('#ffffff')
    .setWrap(true);
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, lastColumn).setWrap(true).setVerticalAlignment('middle');
  }
  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, lastRow, lastColumn).createFilter();
  }
  const widths = {
    'Participant Name': 180,
    'Contact Summary': 260,
    'Church / Group Summary': 260,
    'Emergency Contact Summary': 260,
    'Consent Summary': 170,
    'Conference Interest': 320,
    'Area To Overcome': 320,
    'Square Checkout URL': 260,
    'Square Receipt URL': 260,
  };
  headers.forEach(function(header, index) {
    sheet.setColumnWidth(index + 1, widths[header] || 150);
  });
}

function getNumberCellValue_(row, headers, header) {
  const index = headers.indexOf(header);
  if (index === -1) return 0;
  return normalizeNumber_(row[index], 0);
}

function setNumberCellValue_(row, headers, header, value) {
  const index = headers.indexOf(header);
  if (index !== -1) row[index] = value;
}

function normalizeNumber_(value, fallback) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeActive_(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return !['false', 'no', 'inactive', 'paused', 'disabled', '0'].includes(normalized);
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
