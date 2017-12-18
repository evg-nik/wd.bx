var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),

	//файлы и папки
	del = require('del'),
    rename = require('gulp-rename'),

	//css
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS       = require('gulp-clean-css'),

	//js
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),

	//картинки
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),

	//Автоматичесоке подключение библиотек
	useref = require('gulp-useref'),
	gulpif = require('gulp-if'),

	//include файлов
	rigger = require('gulp-rigger'),

	//deploy
	gutil          = require('gulp-util' ),
	ftp            = require('vinyl-ftp')
;



gulp.task('browser-sync', function() {
	browserSync({
		// proxy:"test----html.bx",
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('html', function() {
	gulp.src('app/xhtml/**/*.html')
		.pipe(rigger())
		.pipe(gulp.dest('app/'))
		.pipe(browserSync.reload({stream: true}));

});

gulp.task('sass', function() {
	return gulp.src([
		'app/sass/**/*.sass',
		'app/sass/**/*.scss',
	])
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		.pipe(cleanCSS()) // Опционально, закомментировать при отладке
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});




gulp.task('libs', function () {
	var d = del.sync('app/js/libs/');



	//bootstrap-grid
	//--------------------------------------------------
	var bg = gulp.src([
		'app/libs/bootstrap-grid/bootstrap-grid.css',
	])
		.pipe(gulp.dest('app/js/libs/bootstrap-grid'));




	//font-awesome
	//--------------------------------------------------
	var fa = gulp.src([
		'app/libs/font-awesome/css/font-awesome.min.css',

	])
		.pipe(gulp.dest('app/js/libs/font-awesome/css'));


	var fa2 = gulp.src([
		'app/libs/font-awesome/fonts/**/*',
	])
		.pipe(gulp.dest('app/js/libs/font-awesome/fonts'));




	//css-hamburgers
	//--------------------------------------------------
	var hu = gulp.src([
		'app/libs/css-hamburgers/dist/hamburgers.min.css',
	])
		.pipe(gulp.dest('app/js/libs/css-hamburgers'));





	//jquery
	//--------------------------------------------------
	var jq = gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
	])
		.pipe(gulp.dest('app/js/libs/jquery'));






	//mmenu
	//--------------------------------------------------
	var mm = gulp.src([
		'app/libs/jQuery.mmenu/dist/jquery.mmenu.all.js',
		'app/libs/jQuery.mmenu/dist/jquery.mmenu.all.css',
	])
		.pipe(gulp.dest('app/js/libs/jQuery.mmenu'));




	//equalheight
	//--------------------------------------------------
	var eq = gulp.src([
		'app/libs/equalheight/dist/jquery.equalheight.js',
	])
		.pipe(gulp.dest('app/js/libs/equalheight'));




	//owl.carousel
	//--------------------------------------------------
	var owlc = gulp.src([
		'app/libs/owl.carousel/dist/owl.carousel.min.js',
		'app/libs/owl.carousel/dist/assets/owl.carousel.min.css',
		'app/libs/owl.carousel/dist/assets/owl.theme.default.min.css',
	])
		.pipe(gulp.dest('app/js/libs/owl.carousel'));



	//fotorama
	//--------------------------------------------------
	var fotora = gulp.src([
		'app/libs/fotorama/fotorama.js',
		'app/libs/fotorama/fotorama.css',
	])
		.pipe(gulp.dest('app/js/libs/fotorama'));



	//selectize
	//--------------------------------------------------
	var selectiz = gulp.src([
		'app/libs/selectize/dist/js/standalone/selectize.js',
		'app/libs/selectize/dist/css/selectize.css',
	])
		.pipe(gulp.dest('app/js/libs/selectize'));











});





gulp.task('watch', ['sass', 'libs', 'html', 'browser-sync'], function() {
	gulp.watch(['app/sass/**/*.sass', 'app/sass/**/*.scss'], ['sass']);
	gulp.watch('app/js/**/*.js', browserSync.reload);
	gulp.watch('app/xhtml/**/*.html', ['html']);
	// gulp.watch('app/**/*.php', browserSync.reload);
});



gulp.task('default', ['watch']);






//******************************************** продакшен ********************************************//






gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('imagemin', function () {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'));
});






gulp.task('build', ['removedist', 'imagemin', 'sass', 'libs', 'html'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/*.php',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

    var buildFonts = gulp.src([
        'app/fonts/**/*',
    ]).pipe(gulp.dest('dist/fonts'));



    var buildCss = gulp.src('app/css/**/*')
		.pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/**/*',
	])
		.pipe(gulp.dest('dist/js'));


});





gulp.task('buildmin', ['removedist', 'imagemin', 'sass', 'libs', 'html'], function() {

	var buildFonts = gulp.src([
		'app/fonts/**/*',
	]).pipe(gulp.dest('dist/fonts'));


	gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css',cleanCSS()))
		.pipe(gulp.dest('dist'));
});




gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'e96134mf.beget.tech',
		user:      'e96134mf_1',
		password:  'zH0NR7*D',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/e96134mf.beget.tech/public_html/test'));

});




//******************************************** end продакшен ********************************************//