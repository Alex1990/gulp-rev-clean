var path = require('path');
var through = require('through2');
var rimraf = require('rimraf');

module.exports = function (keepQuantity) {
  keepQuantity = Number(keepQuantity) || 2;
  var lists = [];

  var stream = through.obj(function (file, enc, cb) {
    var regex = new RegExp('^(.*)-[0-9a-f]{8,30}(?:\\.min)?\\' + path.extname(file.path) + '$');

    if (regex.test(file.path)) {
      lists.push(file);
      lists.sort(function (f1, f2) {
        return f2.stat.ctime - f1.stat.ctime;
      });
    }

    if (lists.length > keepQuantity) {
      var delFile = lists.pop();
      rimraf(path.resolve((delFile.cwd || process.cwd()), delFile.path), function (err) {
        if (err) throw err;
        cb();
      });
    } else {
      cb();
    }
  });
  stream.resume();
  return stream;
}
