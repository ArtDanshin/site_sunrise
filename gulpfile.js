const { src, dest, parallel, watch } = require('gulp');
const stylus = require('gulp-stylus');
const nodemon = require('gulp-nodemon');

function css() {
  return src('assets/stylesheets/old/*.css')
    .pipe(dest('public/assets/stylesheets'))
}

function styl() {
  return src('assets/stylesheets/*.styl')
    .pipe(stylus())
    .pipe(dest('public/assets/stylesheets'))
}

exports.css = css;
exports.stylus = stylus;

exports.build = parallel(css, styl);
exports.watch = function(cb) {
  nodemon({
    script: 'app.js',
    ext: 'js pug json',
    watch: [
      'controllers/',
      'db/',
      'helpers/',
      'scraping/',
      'utils/',
      'views/'
    ],
    done: cb
  });

  watch('assets/stylesheets/old/*.css', css);
  watch('assets/stylesheets/*.styl', styl);
};
