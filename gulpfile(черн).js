var gulp = require('gulp'), // Подключаем Gulp
	sass = require('gulp-sass'), //Подключаем Sass пакет,
	browserSync = require('browser-sync'), // Подключаем Browser Sync

	//файлы и папки
	del = require('del'), // Подключаем библиотеку для удаления файлов и папок
    rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов

	//css
	//// minifyCss = require('gulp-clean-css'),//Подключаем пакет для минификации CSS
	autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
	cleanCSS       = require('gulp-clean-css'),
	//concatCss = require('gulp-concat-css'),//объединить CSS
	

	//js
	uglify = require('gulp-uglify'),// Подключаем пакет для сжатия JS минификация
	concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов) js


	//картинки
	imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями - сжатие
	pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache = require('gulp-cache'), // Подключаем библиотеку кеширования
	//imageResize = require('gulp-image-resize'), // Чтобы разом изменить размеры всех картинок
	//imgRetina = require('gulp-img-retina'), // добавит атрибут srcset картинкам для Retina
	//responsive = require('gulp-responsive'), // responsive картинки (под разный экран)


	//Автоматичесоке подключение библиотек
	//https://www.youtube.com/watch?v=PNlTFa-XzIM&list=PLY4rE9dstrJwXCz1utct9b6Vub9VWQoKo&index=5
	//wiredep = require('wiredep').stream, //Автоматичесоке подключение библиотек
	useref = require('gulp-useref'), //Перекидывает в dist для продакшена
	gulpif = require('gulp-if'), //выборка библиотек из index.html


	//include файлов
	rigger = require('gulp-rigger'),


	//deploy
	gutil          = require('gulp-util' ),
	ftp            = require('vinyl-ftp')
	//notify         = require("gulp-notify"),
	//rsync          = require('gulp-rsync');

;



gulp.task('browser-sync', function() {  // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		// proxy:"test----html.bx",
		server: { // Определяем параметры сервера
			baseDir: 'app' // Директория для сервера - app
		},
		notify: false, // Отключаем уведомления
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

gulp.task('sass', function() { // Создаем таск Sass
	return gulp.src([  // Берем источник
		'app/sass/**/*.sass',
		'app/sass/**/*.scss',
		// '!app/sass/libs.scss'
	])
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})) // Создаем префиксы
		// .pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS()) // Опционально, закомментировать при отладке
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});





//1
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
	gulp.watch(['app/sass/**/*.sass', 'app/sass/**/*.scss'], ['sass']); // Наблюдение за sass файлами в папке sass
	gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
	gulp.watch('app/xhtml/**/*.html', ['html']); // Наблюдение за HTML файлами в корне проекта
	// gulp.watch('app/**/*.php', browserSync.reload); // Наблюдение за PHP файлами в корне проекта
});





// //2
// // Пользовательские скрипты проекта
// gulp.task('common-js', function() {
// 	return gulp.src([
// 		'app/js/common.js',
// 	])
// 		.pipe(concat('common.min.js'))
// 		.pipe(uglify())
// 		.pipe(gulp.dest('app/js'));
// });
//
// gulp.task('js', ['common-js'], function() {
// 	return gulp.src([
// 		'app/libs/jquery/dist/jquery.min.js',
// 		'app/libs/jQuery.mmenu/dist/jquery.mmenu.all.js',
// 		'app/libs/equalheight/dist/jquery.equalheight.js',
// 		'app/libs/owl.carousel/dist/owl.carousel.min.js',
// 		'app/libs/fotorama/fotorama.js',
// 		'app/libs/selectize/dist/js/standalone/selectize.js',
// 		'app/js/common.min.js', // Всегда в конце
// 	])
// 		.pipe(concat('scripts.min.js'))
// 		.pipe(uglify()) // Минимизировать весь js (на выбор)
// 		.pipe(gulp.dest('app/js'))
// 		.pipe(browserSync.reload({stream: true}));
// });
//




// gulp.task('watch2', ['sass', 'js', 'html', 'browser-sync'], function() {
// 	gulp.watch(['app/sass/**/*.sass', 'app/sass/**/*.scss'], ['sass']); // Наблюдение за sass файлами в папке sass
// 	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);  // Наблюдение за JS файлами
// 	gulp.watch('app/**/*.html', ['html']); // Наблюдение за HTML файлами в корне проекта
// 	// gulp.watch('app/**/*.php', browserSync.reload); // Наблюдение за PHP файлами в корне проекта
// });


gulp.task('default', ['watch']);






//******************************************** продакшен ********************************************//






gulp.task('removedist', function() { return del.sync('dist'); });  // Удаляем папку dist перед сборкой
gulp.task('clearcache', function () { return cache.clearAll(); }); // Чистим кеш картинок

gulp.task('imagemin', function () {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		// .pipe(cache(imagemin())) // Cache Images
		.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});






gulp.task('build', ['removedist', 'imagemin', 'sass', 'libs', 'html'], function() {






	var buildFiles = gulp.src([
		'app/*.html',
		'app/*.php',
		'app/.htaccess',
        // '!app/atemplate/',
        // '!app/xhtml/',
        // '!app/sass/',
        // '!app/libs/',
        // '!app/js/libs/',
		]).pipe(gulp.dest('dist'));// Переносим html

    var buildFonts = gulp.src([
        'app/fonts/**/*',
    ]).pipe(gulp.dest('dist/fonts')); // Переносим шрифты в продакшен






    var buildCss = gulp.src('app/css/**/*') // Переносим стили в продакшен
		.pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/**/*',
		// '!app/js/common.min.js',
		// '!app/js/scripts.min.js',
	])
		.pipe(gulp.dest('dist/js'));// Переносим js в продакшен




});





gulp.task('buildmin', ['removedist', 'imagemin', 'sass', 'libs', 'html'], function() {

	var buildFonts = gulp.src([
		'app/fonts/**/*',
	]).pipe(gulp.dest('dist/fonts')); // Переносим шрифты в продакшен


	gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css',cleanCSS()))
		.pipe(gulp.dest('dist'));
});





// gulp.task('build2', ['removedist', 'imagemin', 'sass', 'js', 'html'], function() {
//
// 	var buildFiles = gulp.src([
// 		'app/*',
// 		'!app/atemplate/',
// 		'!app/xhtml/',
// 		'!app/sass/',
// 		'!app/libs/',
// 	]).pipe(gulp.dest('dist'));// Переносим html
//
// 	var buildFonts = gulp.src([
// 		'app/fonts/**/*',
// 	]).pipe(gulp.dest('dist/fonts')); // Переносим шрифты в продакшен
//
// 	var buildCss = gulp.src([
// 		'app/css/main.min.css',
// 	]).pipe(gulp.dest('dist/css')); // Переносим стили в продакшен
//
// 	var buildJs = gulp.src([
// 		'app/js/scripts.min.js',
// 	]).pipe(gulp.dest('dist/js')); // Переносим js в продакшен
//
// 	// var buildCss = gulp.src('app/css/**/*') // Переносим стили в продакшен
// 	//     .pipe(gulp.dest('dist/css'));
//
// 	// var buildJs = gulp.src('app/js/**/*') // Переносим js в продакшен
// 	//     .pipe(gulp.dest('dist/js'));
//
//
//
//
// });




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

// gulp.task('rsync', function() {
// 	return gulp.src('dist/**')
// 	.pipe(rsync({
// 		root: 'dist/',
// 		hostname: 'username@yousite.com',
// 		destination: 'yousite/public_html/',
// 		//include: ['*.htaccess'], // Скрытые файлы, которые необходимо включить в деплой
		// recursive: true,
		// archive: true,
		// silent: false,
		// compress: true
	// }));
// });













//******************************************** end продакшен ********************************************//