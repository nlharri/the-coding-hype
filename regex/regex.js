#!/usr/bin/env node

if (!process.argv[2]) {
	console.log('usage: regex.js <regular expression>');
	return;
}

var fs = require('fs');
var filename = 'datafile.txt';
var str = fs.readFileSync(filename).toString();
var regExp = new RegExp(process.argv[2], 'gi');

var lastIndexPrev = 0;

while (result = regExp.exec(str)) {
	if(result['index']>0) {
			process.stdout.write(str.substring(lastIndexPrev,result['index']));
	}
	process.stdout.write("\x1b[46m\x1b[30m" + str.substring(result['index'],regExp.lastIndex) + "\x1b[0m");
	lastIndexPrev = regExp.lastIndex;
}

process.stdout.write(str.substring(lastIndexPrev,str.length));
