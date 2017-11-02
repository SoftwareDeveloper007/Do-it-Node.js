var path = require('path');

var directories = ['uesrs', 'Lion', 'docs'];
var dirStr = directories.join();
Console.log('dir: ' + dirStr);

var dirStr2 = directories.join(path.sep);
Console.log('dir: ' + dirStr2);

var filepath = path.join('/Users/Mars', 'notepad.exe');
Console.log('filepath: ' + filepath);

var dirname = path.dirname(filepath);
Console.log('dirname: ' + dirname);
var basename = path.basename(filepath);
Console.log('basename: ' + basename);
var extname = path.extname(filepath);
Console.log('extname: ' + extname);
