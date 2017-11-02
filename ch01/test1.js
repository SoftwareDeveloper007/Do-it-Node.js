var path = require('path');

var directories = ['uesrs', 'Lion', 'docs'];
var dirStr = directories.join();
console.log('dir: ' + dirStr);

var dirStr2 = directories.join(path.sep);
console.log('dir: ' + dirStr2);

var filepath = path.join('/Users/Mars', 'notepad.exe');
console.log('filepath: ' + filepath);

var dirname = path.dirname(filepath);
console.log('dirname: ' + dirname);
var basename = path.basename(filepath);
console.log('basename: ' + basename);
var extname = path.extname(filepath);
console.log('extname: ' + extname);
