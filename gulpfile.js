const { src, dest, watch } = require('gulp');
const stylus = require('gulp-stylus');
const nodemon = require('gulp-nodemon');

function styl() {
  return src('app/assets/stylesheets/application.styl')
    .pipe(stylus())
    .pipe(dest('public/assets/stylesheets'))
}

exports.stylus = stylus;

exports.build = styl;
exports.watch = function(cb) {
  nodemon({
    script: 'app.js',
    ext: 'js pug json',
    watch: [
      'app/controllers/',
      'app/helpers/',
      'app/models/',
      'app/views/',
      'config/',
      'db/',
      'utils/'
    ],
    done: cb
  });

  watch('app/assets/stylesheets/**/*.styl', styl);
};
