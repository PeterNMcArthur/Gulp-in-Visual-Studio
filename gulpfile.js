var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');

gulp.task('express', function () {
		var express = require('express');
		var app = express();
		app.use(express.static(__dirname));
		app.listen(4000);
});

gulp.task('sass', function () {
		gulp.src('./sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./css'))
		.pipe(livereload());
});

gulp.task('lint', function () {
		gulp.src('./js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(livereload());
});

gulp.task('js:testing', function () {
		gulp.src('./test/spec/*.js')
		.pipe(jasmine())
		.pipe(livereload());
});

gulp.task('watch', function () {
		
		livereload.listen();

		gulp.watch('./sass/**/*.scss', ['sass']);
		gulp.watch('./js/*.js', ['lint']);
		gulp.watch('./test/spec/*.js', ['js:testing'])
		gulp.watch('./js/*.js', ['js:testing']);
});

gulp.task('default', ['express', 'sass'], function () {

});
