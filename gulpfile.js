var gulp = require('gulp'),
	sass = require('gulp-sass')(require('sass')),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	jshint = require('gulp-jshint'),
	header  = require('gulp-header'),
	rename = require('gulp-rename'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	gutil = require('gulp-util'),
	sourcemaps = require('gulp-sourcemaps'),
	package = require('./package.json'),
	uglify = require('gulp-uglify');

var banner = [
	'/*!\n' +
	' * <%= package.name %>\n' +
	' * <%= package.title %>\n' +
	' * <%= package.url %>\n' +
	' * @author <%= package.author %>\n' +
	' * @version <%= package.version %>\n' +
	' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
	' */',
	'\n'
].join('');

var cssVendors = [
		'src/styles/vendors/styles.scss'
	],
	cssVendorsDest = 'dist/styles/vendors';
var cssFiles = [
		'src/styles/local/styles.scss'
	],
	cssFilesDest = 'dist/styles/local';

gulp.task('styles', function(done) {
	// return gulp.src(cssFiles)
	gulp.src(cssVendors)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer('last 4 version'))
		.pipe(gulp.dest(cssVendorsDest))
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(header(banner, { package : package }))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(cssVendorsDest))
		.pipe(browserSync.reload({stream:true}));
	gulp.src(cssFiles)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer('last 4 version'))
		.pipe(gulp.dest(cssFilesDest))
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(header(banner, { package : package }))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(cssFilesDest))
		.pipe(browserSync.reload({stream:true}));
	done()
});

var jsVendors = [
		'src/scripts/vendors/*.js',
	],
	jsVendorsDest = 'dist/scripts/vendors';

var jsFiles = [
		'src/scripts/local/*.js',
	],
	jsFilesDest = 'dist/scripts/local';

gulp.task('javascript',function(done){
	gulp.src(jsFiles)
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(header(banner, { package : package }))
		.pipe(gulp.dest(jsFilesDest))
		.pipe(uglify().on('error', gutil.log))
		.pipe(header(banner, { package : package }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(jsFilesDest))
		.pipe(browserSync.reload({stream:true, once: true}));
	gulp.src(jsVendors)
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(header(banner, { package : package }))
		.pipe(gulp.dest(jsVendorsDest))
		.pipe(uglify().on('error', gutil.log))
		.pipe(header(banner, { package : package }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(jsVendorsDest))
		.pipe(browserSync.reload({stream:true, once: true}));
	done()
});

gulp.task('browser-sync', function(done){
	browserSync.init({
		proxy: "http://janmichael.local"
	});
	done()
});

gulp.task('bs-reload', function(done) {
	browserSync.reload();
	done()
});

gulp.task('watch', function(done) {
	gulp.watch('./src/styles/vendors/*.scss', gulp.series('styles'));
	gulp.watch('./src/styles/local/styles.scss', gulp.series('styles'));
	gulp.watch('./src/styles/local/*/*.scss', gulp.series('styles'));
	gulp.watch('./src/scripts/vendors/*.js', gulp.series('javascript'));
	gulp.watch('./src/scripts/local/scripts.js', gulp.series('javascript'));
	gulp.watch('./src/scripts/local/*/*.js', gulp.series('javascript'));
	gulp.watch('./*.php', gulp.series('bs-reload'));
	gulp.watch('./src/scaffolding/*/*.php', gulp.series('bs-reload'));

	done()
});

gulp.task( 'default', gulp.series('styles', 'javascript', 'browser-sync', 'watch'));
