const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const mode = '-t56o10o12';
const lzxName = (a => a.substr(0, a.lastIndexOf('.')) + mode + '.lzx');

let bin = fs.readFileSync(path.normalize('../haystack'));

for (let i = 0, ptr = 0; ptr < bin.length; ptr += 16384, i++) {
	console.log(`~ compressing haystack pg${i}...`);

	const a = `haystack.pg${i}.tmp`;
	fs.writeFileSync(a, bin.slice(ptr, ptr + 16384));

	spawnSync('lzxpack', [mode, a],
		{ windowsHide: true, shell: true, cwd: '.' });

	const pak = a.replace('.tmp', '.pak');
	fs.unlinkSync(a);
	fs.renameSync(lzxName(a), pak);

	console.log(`= ${fs.statSync(pak).size} bytes...`);
}

[ 'needle1', 'needle3', 'needle4', 'needle6', 'needle7' ].forEach(a => {
	console.log(`~ compressing ${a}...`);

	const src = path.normalize(`../${a}.`);

	spawnSync('lzxpack', [mode, src],
		{ windowsHide: true, shell: true, cwd: '.' });

	a += '.pak';
	fs.renameSync(lzxName(src), a);

	console.log(`= ${fs.statSync(a).size} bytes...`);
});

{
	let a = 'loading.scr';
	console.log(`~ compressing ${a}...`);

	spawnSync('lzxpack', [mode, a],
		{ windowsHide: true, shell: true, cwd: '.' });

	const pak = a.replace('.scr', '.pak');
	fs.renameSync(lzxName(a), pak);

	console.log(`= ${fs.statSync(pak).size} bytes...`);
}

{
	let a = 'final.bin';
	console.log(`~ compressing kernel...`);

	spawnSync('lzxpack', [mode, a],
		{ windowsHide: true, shell: true, cwd: '.' });

	const pak = a.replace('.bin', '.pak');
	fs.renameSync(lzxName(a), pak);

	console.log(`= ${fs.statSync(pak).size} bytes...`);
}
