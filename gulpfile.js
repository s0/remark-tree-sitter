var gulp = require('gulp');
var clean = require('gulp-clean');
var gutil = require("gulp-util");
var ts = require('gulp-typescript');
var tslint = require('tslint');
var gulpTslint = require('gulp-tslint');
var runSequence = require('run-sequence');

var tsProject = ts.createProject('src/tsconfig.json');

// Utility Functions

function handleError(err) {
  gutil.log("Build failed", err.message);
  process.exit(1);
}

gulp.task('clean', function() {
  return gulp.src(['dist'], {read: false})
        .pipe(clean());
});

gulp.task('ts', function () {
    return tsProject.src()
      .pipe(tsProject())
      .on('error', handleError)
      .pipe(gulp.dest('dist/'));
});

gulp.task('copy-package-json', function () {
    return gulp.src(['package.json', 'README.md']).pipe(gulp.dest('dist'));
});

gulp.task('tslint', function() {
  var program = tslint.Linter.createProgram("src/tsconfig.json");

  return gulp.src(['src/**/*.ts'])
  .pipe(gulpTslint({
    formatter: 'verbose',
    configuration: 'tslint.json',
    program
  }))
  .on('error', handleError)
  .pipe(gulpTslint.report());
});

gulp.task('default', function(callback) {
  runSequence(
    'clean',
    ['ts', 'copy-package-json'],
    'tslint',
    callback);
});
