var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

function build() {
    return gulp.src('src/js/*.js')
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('static/js'));
}

function watch() {
    gulp.watch('src/js/*.js', build);
}

exports.watch = watch;
exports.build = build;
exports.default = build;
