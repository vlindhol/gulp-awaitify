const chai = require('chai');
const es = require('event-stream');
const File = require('vinyl');
const awaitify = require('./index');

describe('gulp-awaitify', function() {
  describe('in buffer mode', function() {

    it('should correctly awaitify valid code', function(done) {
      const code = 'async function f() { const a = target(); }';
      const expected =
`async function f() {
    const a = await target();
}`;
      // create the fake file
      var fakeFile = new File({
        contents: new Buffer(code, 'utf8'),
      });

      // Create an awaitify plugin stream
      var plugin = awaitify(['target']);

      // write the fake file to it
      plugin.write(fakeFile);

      // wait for the file to come back out
      plugin.once('data', function(file) {
        // make sure it came out the same way it went in
        chai.expect(file.isBuffer()).to.be.true;

        // check the contents
        chai.expect(file.contents.toString('utf8')).to.equal(expected);
        done();
      });
    });
  });
});