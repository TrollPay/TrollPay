/* ***************
 * NODE PACKAGES *
 * ***************/

var gulp = require('gulp'),
  bower = require('gulp-bower'),
  plumber = require('gulp-plumber'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  foreman = require('gulp-foreman'),
  minifyCss = require('gulp-minify-css'),
  react = require('gulp-react');

/* ************
 * FILE PATHS *
 * ************/

var path = {};

/* Client */
path.BOWER_COMPONENTS_DIR = './bower_components';
path.VENDOR_JS_DIR = './client/dist/js/vendor/';
path.VENDOR_CSS_DIR = './client/dist/css/vendor/';
path.BUILD_JS_DIR = './client/dist/js/build';

/* Build */
path.BUILD_JSX = [ 
  './client/build/views/*.jsx',
  './client/build/*.jsx'
];
path.BUILD_MIN = 'build-jsx.min.js';

/* React */
path.REACT_SRC = [
  './bower_components/react/react.js',
  './bower_components/react/JSXTransformer.js'
];
path.REACT_MIN = 'react-with-jsxtransformer.min.js';

/* JQuery */
path.JQUERY_SRC = './bower_components/jquery/dist/jquery.min.js';
path.JQUERY_MAP_SRC = './bower_components/jquery/dist/jquery.min.map';

/* Boostrap */
path.BOOTSTRAP_JS_SRC = [
  './bower_components/bootstrap/dist/js/bootstrap.js'
];
path.BOOTSTRAP_JS_MIN = 'bootstrap.min.js';

path.BOOTSTRAP_CSS_SRC = [
  './bower_components/bootstrap/dist/css/bootstrap-theme.css',
  './bower_components/bootstrap/dist/css/bootstrap.css'
];
path.BOOTSTRAP_CSS_MIN = 'bootstrap.min.css';

/* Server */
path.SERVER_SRC = './server/server.js';

/* ************
 * GULP TASKS *
 * ************/

gulp.task('default', []);
gulp.task('build', ['bower', 'vendor', 'buildApp']);
gulp.task('dev', ['build', 'foreman']);

/* Download bower components */
gulp.task('bower', function() {
  return bower().pipe(gulp.dest(path.BOWER_COMPONENTS_DIR));
});

/* Uglify and concat our app build jsx and js files */

gulp.task('buildApp', function() {
  //JSX
  gulp.src(path.BUILD_JSX)
    .pipe(react())
    .pipe(concat(path.BUILD_MIN))
    .pipe(gulp.dest(path.BUILD_JS_DIR));

});

/* Uglify and concat third party libraries/frameworks */
gulp.task('vendor', function() {

  // React
  gulp.src(path.REACT_SRC)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat(path.REACT_MIN))
    .pipe(gulp.dest(path.VENDOR_JS_DIR));

  // jQuery
  gulp.src(path.JQUERY_SRC)
    .pipe(gulp.dest(path.VENDOR_JS_DIR));
  gulp.src(path.JQUERY_MAP_SRC)
    .pipe(gulp.dest(path.VENDOR_JS_DIR));

  // Bootstrap JS
  gulp.src(path.BOOTSTRAP_JS_SRC)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat(path.BOOTSTRAP_JS_MIN))
    .pipe(gulp.dest(path.VENDOR_JS_DIR));

  // Bootstrap CSS
  gulp.src(path.BOOTSTRAP_CSS_SRC)
    .pipe(plumber())
    .pipe(minifyCss())
    .pipe(concat(path.BOOTSTRAP_CSS_MIN))
    .pipe(gulp.dest(path.VENDOR_CSS_DIR));

});

/* Start a local development server with nodemon */
gulp.task('foreman', function() {
  foreman({
    procfile: 'Procfile.dev',
    env: '.env'
  });
});
