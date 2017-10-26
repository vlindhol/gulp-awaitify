// through2 is a thin wrapper around node transform streams
var through = require('through2');
var awaitify = require('node-awaitify');

// Consts
var PLUGIN_NAME = 'gulp-awaitify';

// Plugin level function(dealing with files)
function gulpAwaitify(funcList) {
  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // return empty file
      return cb(null, file);
    }
    if (file.isBuffer()) {
      var strContents = file.contents.toString(enc || 'utf8');
      if(strContents) {
        try {
          var transformedContents = awaitify(strContents, funcList || []);
          file.contents = Buffer.from(transformedContents, enc || 'utf8');
        } catch (err) {
          cb(err, file);
          return;
        }
      }
    }
    /*
    if (file.isStream()) {
      file.contents = file.contents.pipe(prefixStream(prefixText));
    }
    */

    cb(null, file);

  });

}

// Exporting the plugin main function
module.exports = gulpAwaitify;
