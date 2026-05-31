const SHEET_NAME='Registrations',GROUP_CODES_SHEET_NAME='Group Codes',SCRIPT_PROPERTY_SPREADSHEET_ID='SPREADSHEET_ID',SCRIPT_PROPERTY_WEBHOOK_SECRET='WEBHOOK_SECRET';
const GROUP_CODE_HEADERS=['Code','Group Name','Discount CAD','Max Uses','Used','Active','Notes','Last Used At'];
function doPost(e){
  try{
    const body=JSON.parse(e.postData.contents||'{}'),props=PropertiesService.getScriptProperties(),expectedSecret=props.getProperty(SCRIPT_PROPERTY_WEBHOOK_SECRET);
    if(!expectedSecret||body.secret!==expectedSecret)return jsonResponse_({ok:false,message:'Unauthorized'});
    const id=props.getProperty(SCRIPT_PROPERTY_SPREADSHEET_ID),ss=id?SpreadsheetApp.openById(id):SpreadsheetApp.getActiveSpreadsheet(),action=body.action||'appendRegistration',headers=Array.isArray(body.headers)?body.headers:[],row=Array.isArray(body.row)?body.row:[],lock=LockService.getScriptLock();
    lock.waitLock(10000);
    try{
      if(action==='updatePaymentLink'){ensureHeaderRow_(getOrCreateSheet_(ss,SHEET_NAME),headers);return jsonResponse_(updatePaymentLink_(ss,body.update||{}));}
      if(action==='markSquarePayment'){ensureHeaderRow_(getOrCreateSheet_(ss,SHEET_NAME),headers);return jsonResponse_(markSquarePayment_(ss,body.update||{}));}
      const codeResult=applyGroupRegistrationCode_(ss,headers,row);
      if(!codeResult.ok)return jsonResponse_(codeResult);
      const sheet=getOrCreateSheet_(ss,SHEET_NAME),sheetHeaders=ensureHeaderRow_(sheet,headers);
      sheet.appendRow(alignRowToHeaders_(headers,row,sheetHeaders));formatRegistrationSheet_(sheet,sheetHeaders);
      return jsonResponse_({ok:true,spreadsheetUrl:ss.getUrl(),sheetName:sheet.getName(),appendedRow:sheet.getLastRow(),discountCad:codeResult.discountCad||0,finalAmountCad:getNumberCellValue_(row,headers,'Final Amount CAD')});
    }finally{lock.releaseLock();}
  }catch(error){return jsonResponse_({ok:false,message:String(error)});}
}
function getOrCreateSheet_(ss,name){return ss.getSheetByName(name)||ss.insertSheet(name);}
function ensureHeaderRow_(sheet,headers){
  if(!headers.length)return getSheetHeaders_(sheet);
  if(sheet.getLastRow()===0){sheet.appendRow(headers);sheet.setFrozenRows(1);sheet.getRange(1,1,1,headers.length).setFontWeight('bold');return headers.slice();}
  const count=Math.max(sheet.getLastColumn(),headers.length),current=sheet.getRange(1,1,1,count).getValues()[0],has=current.some(function(v){return v;});
  if(!has){sheet.getRange(1,1,1,headers.length).setValues([headers]);sheet.setFrozenRows(1);sheet.getRange(1,1,1,headers.length).setFontWeight('bold');return headers.slice();}
  const merged=current.filter(function(h){return h;});headers.forEach(function(h){if(!merged.includes(h))merged.push(h);});sheet.getRange(1,1,1,merged.length).setValues([merged]);sheet.setFrozenRows(1);sheet.getRange(1,1,1,merged.length).setFontWeight('bold');return merged;
}
function applyGroupRegistrationCode_(ss,headers,row){
  const codeIndex=headers.indexOf('Group Registration Code');
  if(codeIndex===-1)return{ok:true,discountCad:0};
  const requestedCode=String(row[codeIndex]||'').trim().toUpperCase();
  if(!requestedCode)return{ok:true,discountCad:0};
  row[codeIndex]=requestedCode;
  const sheet=getOrCreateSheet_(ss,GROUP_CODES_SHEET_NAME);ensureHeaderRow_(sheet,GROUP_CODE_HEADERS);
  if(sheet.getLastRow()<2)return{ok:false,code:'group_registration_code_not_found',message:'Group registration code was not found.'};
  const values=sheet.getRange(2,1,sheet.getLastRow()-1,GROUP_CODE_HEADERS.length).getValues();
  for(let i=0;i<values.length;i+=1){
    const r=values[i],stored=String(r[0]||'').trim().toUpperCase();
    if(stored!==requestedCode)continue;
    if(!normalizeActive_(r[5]))return{ok:false,code:'group_registration_code_inactive',message:'Group registration code is not active.'};
    const max=normalizeNumber_(r[3],0),used=normalizeNumber_(r[4],0);
    if(max>0&&used>=max)return{ok:false,code:'group_registration_code_exhausted',message:'Group registration code has already been fully used.'};
    const discount=Math.max(0,normalizeNumber_(r[2],0)),base=getNumberCellValue_(row,headers,'Base Fee CAD'),finalAmount=Math.max(base-discount,0),sheetRow=i+2;
    setNumberCellValue_(row,headers,'Discount CAD',discount);setNumberCellValue_(row,headers,'Final Amount CAD',finalAmount);sheet.getRange(sheetRow,5).setValue(used+1);sheet.getRange(sheetRow,8).setValue(new Date().toISOString());
    return{ok:true,discountCad:discount,finalAmountCad:finalAmount,groupRegistrationCode:requestedCode,groupName:String(r[1]||'').trim()};
  }
  return{ok:false,code:'group_registration_code_not_found',message:'Group registration code was not found.'};
}
function updatePaymentLink_(ss,update){
  const sheet=getOrCreateSheet_(ss,SHEET_NAME),headers=getSheetHeaders_(sheet),id=String(update.registrationId||'').trim();
  if(!id)return{ok:false,code:'missing_registration_id',message:'Registration ID is required to update payment link.'};
  const row=findRowByHeaderValue_(sheet,headers,'Registration ID',id);
  if(!row)return{ok:false,code:'registration_not_found',message:'Registration was not found in the sheet.'};
  setCellValueByHeader_(sheet,headers,row,'Payment Status',update.paymentStatus||'checkout_link_created');setCellValueByHeader_(sheet,headers,row,'Payment Method',update.paymentMethod||'Square Checkout');setCellValueByHeader_(sheet,headers,row,'Final Amount CAD',update.finalAmountCad);setCellValueByHeader_(sheet,headers,row,'Square Checkout URL',update.squareCheckoutUrl||'');setCellValueByHeader_(sheet,headers,row,'Square Payment Link ID',update.squarePaymentLinkId||'');setCellValueByHeader_(sheet,headers,row,'Square Order ID',update.squareOrderId||'');formatRegistrationSheet_(sheet,headers);
  return{ok:true,registrationId:id,updatedRow:row};
}
function markSquarePayment_(ss,update){
  const sheet=getOrCreateSheet_(ss,SHEET_NAME),headers=getSheetHeaders_(sheet),orderId=String(update.squareOrderId||'').trim();
  if(!orderId)return{ok:false,code:'missing_square_order_id',message:'Square order ID is required to update payment status.'};
  const row=findRowByHeaderValue_(sheet,headers,'Square Order ID',orderId);
  if(!row)return{ok:false,code:'square_order_not_found',message:'Square order was not found in the registration sheet.'};
  setCellValueByHeader_(sheet,headers,row,'Payment Status',update.paymentStatus||'square_payment_updated');setCellValueByHeader_(sheet,headers,row,'Square Payment ID',update.squarePaymentId||'');setCellValueByHeader_(sheet,headers,row,'Square Receipt URL',update.squareReceiptUrl||'');if(update.paidAt)setCellValueByHeader_(sheet,headers,row,'Paid At',update.paidAt);formatRegistrationSheet_(sheet,headers);
  return{ok:true,squareOrderId:orderId,updatedRow:row};
}
function getSheetHeaders_(sheet){return sheet.getLastColumn()===0?[]:sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];}
function findRowByHeaderValue_(sheet,headers,header,value){
  const col=headers.indexOf(header)+1;if(!col||sheet.getLastRow()<2)return 0;
  const values=sheet.getRange(2,col,sheet.getLastRow()-1,1).getValues();
  for(let i=0;i<values.length;i+=1){if(String(values[i][0]||'').trim()===value)return i+2;}
  return 0;
}
function setCellValueByHeader_(sheet,headers,row,header,value){const col=headers.indexOf(header)+1;if(col)sheet.getRange(row,col).setValue(value===undefined?'':value);}
function alignRowToHeaders_(sourceHeaders,row,targetHeaders){const byHeader={};sourceHeaders.forEach(function(h,i){byHeader[h]=row[i];});return targetHeaders.map(function(h){return byHeader[h]===undefined?'':byHeader[h];});}
function formatRegistrationSheet_(sheet,headers){const lastCol=Math.max(sheet.getLastColumn(),headers.length,1),lastRow=Math.max(sheet.getLastRow(),1);sheet.setFrozenRows(1);sheet.setFrozenColumns(Math.min(5,lastCol));sheet.getRange(1,1,1,lastCol).setFontWeight('bold').setBackground('#24283d').setFontColor('#ffffff').setWrap(true);if(lastRow>1)sheet.getRange(2,1,lastRow-1,lastCol).setWrap(true).setVerticalAlignment('middle');if(!sheet.getFilter())sheet.getRange(1,1,lastRow,lastCol).createFilter();const widths={'Participant Name':180,'Contact Summary':260,'Church / Group Summary':260,'Emergency Contact Summary':260,'Consent Summary':170,'Conference Interest':320,'Area To Overcome':320,'Square Checkout URL':260,'Square Receipt URL':260};headers.forEach(function(h,i){sheet.setColumnWidth(i+1,widths[h]||150);});}
function getNumberCellValue_(row,headers,header){const i=headers.indexOf(header);return i===-1?0:normalizeNumber_(row[i],0);}
function setNumberCellValue_(row,headers,header,value){const i=headers.indexOf(header);if(i!==-1)row[i]=value;}
function normalizeNumber_(value,fallback){const n=Number(value);return Number.isFinite(n)?n:fallback;}
function normalizeActive_(value){const n=String(value||'').trim().toLowerCase();return !['false','no','inactive','paused','disabled','0'].includes(n);}
function jsonResponse_(payload){return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);}
