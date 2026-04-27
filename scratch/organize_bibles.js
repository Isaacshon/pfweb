const fs = require('fs');
const path = require('path');

const targetDir = path.join('public', 'bible');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const moves = [
    { from: 'bible.json', to: 'bible_nkrv.json' },
    { from: 'bible_klb.json', to: 'bible_klb.json' },
    { from: 'bible_cn.json', to: 'bible_cn.json' },
    { from: 'bible_es.json', to: 'bible_es.json' }
];

moves.forEach(m => {
    const fromPath = m.from;
    const toPath = path.join(targetDir, m.to);
    if (fs.existsSync(fromPath)) {
        fs.renameSync(fromPath, toPath);
        console.log(`Moved ${fromPath} to ${toPath}`);
    } else {
        console.log(`${fromPath} not found, skipping.`);
    }
});
