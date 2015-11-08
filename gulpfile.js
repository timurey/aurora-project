'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    uncss = require("gulp-uncss"),
    reload = browserSync.reload,
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    mainBowerFiles = require('main-bower-files'),
    wiredep = require('wiredep').stream,
    order = require("gulp-order"),
    googlecdn = require('gulp-google-cdn'),
    replace = require('gulp-replace'),
    less = require('gulp-less');


var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/css/main.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
        self : 'src'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.*',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(order())
        .pipe(rigger()) //Прогоним через rigger
        .pipe(wiredep())
        .pipe(googlecdn(require('./bower.json')))
        .pipe(replace('<script src="bower_components/', '<script src="js/'))
        .pipe(replace('<link rel="stylesheet" href="bower_components/','<link rel="stylesheet" href="css/'))
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('mainJS', function() {
    gulp.src(mainBowerFiles('**/*.js'),{ base: './src/bower_components' })
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true})); //И перезагрузим сервер
});
gulp.task('mainFonts', function() {
    var files = ['**/*.eot','**/*.svg','**/*.ttf','**/*.woff','**/*.woff2'];
    gulp.src(mainBowerFiles(files),{ base: './src/bower_components' })
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('mainCSS', function() {
    gulp.src(mainBowerFiles('**/*.css'),{ base: './src/bower_components' })
        .pipe(gulp.dest(path.build.css))
        gulp.src(path.src.style) //Найдем наш main файл
        .pipe(gulp.dest(path.build.css)) //Выплюнем готовый файл в build
    gulp.src(mainBowerFiles('**/*.scss'),{ base: './src/bower_components' })
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем                
        .pipe(uncss({
           html:['build/index.html']
     }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build


    .pipe(reload({stream: true})); //И перезагрузим сервер
});
gulp.task('less',function(){
            gulp.src(mainBowerFiles('**/*.less'),{ base: './src/bower_components' })
        .pipe(less())
        .pipe(gulp.dest(path.build.css)) //И в build
});
gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main.js файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(gulpif(argv.production, uglify())) //Сожмем наш если указан параметр gulp --production
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
//        .pipe(imagemin({ //Сожмем их
//            progressive: true,
//            svgoPlugins: [{removeViewBox: false}],
//            use: [pngquant()],
//            interlaced: true
//        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'mainJS',
    'mainCSS',
    'mainFonts',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


gulp.task('default', ['build', 'webserver', 'watch']);

