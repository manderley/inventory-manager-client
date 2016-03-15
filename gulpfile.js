/* eslint-env node */
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var cssimport = require('postcss-import');
var cssnext = require('postcss-cssnext');
var reporter = require('postcss-reporter');
var nano = require('gulp-cssnano');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');

gulp.task('styles', function() {
	return (
		gulp.src('./css/all.css')
			.pipe(postcss([
				cssimport(),
				cssnext(),
				reporter()
			]))
			.pipe(nano())
			.pipe(gulp.dest('./dist/css'))
			.pipe(browserSync.stream())
	);
});

gulp.task('copy-html', function() {
	gulp.src('./index.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-libs', function() {
	gulp.src('libs/*.js')
		.pipe(gulp.dest('./dist/libs'));
});

gulp.task('scripts', function() {
	return (
		gulp.src('js/app.js')
			.pipe(babel())
			.pipe(gulp.dest('./dist/js'))
	);
	
});

gulp.task('lint', function() {
	return gulp.src(['js/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

// task to ensure 'scripts' task is complete before reloading browsers
gulp.task('scripts-watch', ['scripts'], browserSync.reload);

gulp.task('watch', function() {
	browserSync.init({
		server: './dist',
		port: 8080
	});

	gulp.watch('css/*.css', ['styles']);
	gulp.watch('js/*.js', ['lint', 'scripts-watch']);
	gulp.watch('./index.html', ['copy-html']);
	gulp.watch('libs/*.js', ['copy-libs']);
	gulp.watch('./dist/index.html').on('change', browserSync.reload);
});

gulp.task('default', ['copy-html', 'copy-libs', 'styles', 'lint', 'scripts', 'watch']);