/* ***************
 * NODE PACKAGES *
 * ***************/

var gulp = require('gulp'),
  bower = require('gulp-bower'),
  plumber = require('gulp-plumber'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  nodemon = require('gulp-nodemon'),
  minifyCss = require('gulp-minify-css');

/* ************
 * FILE PATHS *
 * ************/

var path = {};

/* Root */
path.BOWER_COMPONENTS_DIR = './bower_components/';

/* Client */

//React
path.CLIENT_DIR = './client/';
path.DIST_DIR = path.CLIENT_DIR + './dist/';
path.VENDOR_DIR = path.DIST_DIR + 'vendor/';

path.INDEX_SRC = path.CLIENT_DIR + 'index.html';

path.REACT_DIR = path.BOWER_COMPONENTS_DIR + 'react/';
path.REACT_SRC = [
  path.REACT_DIR + 'react.js',
  path.REACT_DIR + 'JSXTransformer.js'
];
path.REACT_MIN_SRC = 'react-with-jsxtransformer.min.js';

//Boostrap
path.BOOTSTRAP_DIR = path.BOWER_COMPONENTS_DIR + 'bootstrap/';
path.BOOTSTRAP_JS_DIR = path.BOOTSTRAP_DIR + '/dist/js/';
path.BOOTSTRAP_CSS_DIR = path.BOOTSTRAP_DIR + '/dist/css/';

path.BOOTSTRAP_JS_SRC = [
  path.BOOTSTRAP_JS_DIR + 'bootstrap.js',
  path.BOOTSTRAP_JS_DIR + 'npm.js'
];
path.BOOTSTRAP_JS_MIN_SRC = 'bootstrap-with-npm.min.js';

path.BOOTSTRAP_CSS_SRC = [
  path.BOOTSTRAP_CSS_DIR + 'bootstrap-theme.css',
  path.BOOTSTRAP_CSS_DIR + 'bootstrap.css'
]
path.BOOTSTRAP_CSS_MIN_SRC = 'bootstrap.min.css'

/* Server */
path.SERVER_DIR = './server/';

path.SERVER_SRC = path.SERVER_DIR + 'server.js';

/* ************
 * GULP TASKS *
 * ************/

gulp.task('default', []);
gulp.task('build', ['bower', 'vendor']);
gulp.task('server', ['nodemon']);
gulp.task('dev', ['build', 'watch']);

/* Download bower componenets */
gulp.task('bower', function(){
  return bower().pipe(gulp.dest(path.BOWER_COMPONENTS_DIR));
});

/* Uglify and concat third party libraries/frameworks */
gulp.task('vendor', function() {

  // React
  gulp.src(path.REACT_SRC)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat(path.REACT_MIN_SRC))
    .pipe(gulp.dest(path.VENDOR_DIR));

  //Bootstrap JS
  gulp.src(path.BOOTSTRAP_JS_SRC)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat(path.BOOTSTRAP_JS_MIN_SRC))
    .pipe(gulp.dest(path.VENDOR_DIR));

  //BOOTSTRAP CSS
  gulp.src(path.BOOTSTRAP_CSS_SRC)
    .pipe(plumber())
    .pipe(minifyCss())
    .pipe(concat(path.BOOTSTRAP_CSS_MIN_SRC))
    .pipe(gulp.dest(path.VENDOR_DIR));

});


/* Start the server with nodemon */
gulp.task('nodemon', function() {
  nodemon({
    script: path.SERVER_SRC,
    ext: 'js html'
  });
});

gulp.task('log', function(){
  console.log('yes');
});

gulp.task('watch', function() {
  gulp.watch(path.INDEX_SRC, ['log']);
});
