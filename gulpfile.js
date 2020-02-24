const { src, dest, watch, series } = require('gulp');
const stylus = require('gulp-stylus');
const nodemon = require('gulp-nodemon');
const rimraf = require('rimraf');
const util = require('util');

function styl() {
  return src(['app/assets/stylesheets/application.styl', 'app/assets/stylesheets/personal.styl'])
    .pipe(stylus())
    .pipe(dest('public/assets/stylesheets'))
}

function images() {
  return util.promisify(rimraf)('public/assets/images')
    .then(() => {
      return src('app/assets/images/**/*')
        .pipe(dest('public/assets/images'));
    });
}

exports.stylus = stylus;
exports.images = images;

exports.build = series(styl, images);
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

  // TODO: При первом запуске dev сервера не происходит сборки стилей и изображений

  watch('app/assets/stylesheets/**/*.styl', styl);
  watch('app/assets/images/**/*', images);
};
