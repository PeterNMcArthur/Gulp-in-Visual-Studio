var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var karma = require('gulp-karma');
var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var assign = require('lodash.assign');

var karmaTestFiles = [
	'app/js/*.js',
	'app/test/spec/*.js'
];

gulp.task('express', function () {
		var express = require('express');
		var app = express();
		app.use(express.static(__dirname));
		app.listen(4000);
});

gulp.task('sass', function () {
		gulp.src('./app/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./app/css'))
		.pipe(livereload());
});
gulp.task('principalStyle', function () {
		gulp.src('./app/sass/principal-style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./app/css'))
		.pipe(livereload());
})

gulp.task('lint', function () {
		gulp.src('./app/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(livereload());
});

gulp.task('js:testing', function () {
		gulp.src('./app/test/spec/*.js')
		.pipe(jasmine())
		.pipe(livereload());
});

gulp.task('js:karma', function() {
	return gulp.src(karmaTestFiles)
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			throw err;
		});
});

gulp.task('html', function() { 
	return gulp.src([ './app/*.html' ]) 
	.pipe(livereload()); 
});

var customOpts = {
  entries: ['./app/js/app.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('browserify', bundle); // so you can run `gulp browserify` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./app'));
}

gulp.task('watch', function () {
		
		livereload.listen();

		gulp.watch('./app/sass/**/*.scss', ['sass']);
		gulp.watch('./app/sass/principal-style.scss', ['principalStyle']);
		gulp.watch('./app/js/**/*.js', ['lint']);
		gulp.watch('./app/test/spec/**/*.js', ['js:testing'])
		gulp.watch('./app/js/**/*.js', ['js:testing']);
    gulp.watch('./app/js/app.js', ['browserify']);
		gulp.watch('./app/*.html', ['html']);
});

gulp.task('default', ['express', 'sass'], function () {

});
