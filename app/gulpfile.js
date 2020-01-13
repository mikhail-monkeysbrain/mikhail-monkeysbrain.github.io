let 
    gulp = require('gulp'),
    gp = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create();
    
gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: '../'
        }
    });
});

gulp.task('pug', () => {
    return gulp.src('pug/pages/*.pug')
        .pipe(gp.pug({
            locals: require('./data/data.json'),
            pretty: true
        }))
        .pipe(gulp.dest('../'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('stylus', () => {
    return gulp.src('static/stylus/main.styl')
    .pipe(gp.sourcemaps.init())
    .pipe(gp.stylus({
        'include css': true
    }))
    .pipe(gp.autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
    }))
    .on('error', gp.notify.onError({
        title: 'style'
    }))
    .pipe(gp.csso())
    .pipe(gp.sourcemaps.write())
    .pipe(gulp.dest('../dist/css/'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('scripts', () => {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/slick-carousel/slick/slick.min.js',
        'static/js/vendors/*.js',
        'static/js/scripts/**/*.js'
    ])
    .pipe(gp.concat('app.js'))
    .pipe(gulp.dest('../dist/js/'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('sprite', function() {
  var spriteData = 
    gulp.src('static/sprite/**/*.*')
      .pipe(gp.spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.styl',
        cssFormat: 'stylus',
        algorithm: 'binary-tree',
        cssVarMap: function(sprite) {
          sprite.name = 's-' + sprite.name
        }
      }));
  spriteData.img.pipe(gulp.dest('../dist/img/'));
  spriteData.css.pipe(gulp.dest('static/stylus/sprite'));
});

gulp.task('img:dev', () =>
    gulp.src('static/img/**/*.*')
        .pipe(gulp.dest('../dist/img/'))
);

gulp.task('img:build', () =>
    gulp.src('static/img/**/*.*')
        .pipe(gp.imagemin([
            gp.imagemin.gifsicle({interlaced: true}),
            gp.imagemin.jpegtran({progressive: true}),
            gp.imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest('../dist/img/'))
);

gulp.task('fonts', () =>
    gulp.src('static/fonts/**/*.*')
        .pipe(gulp.dest('../dist/fonts/'))
);

gulp.task('watch', () => {
    gulp.watch('pug/**/*.pug', gulp.series('pug'))
    gulp.watch('data/data,json', gulp.series('pug'))
    gulp.watch('static/stylus/**/*.styl', gulp.series('stylus'))
    gulp.watch('static/js/**/*.js', gulp.series('scripts'))
    gulp.watch('static/sprite/**/*.*', gulp.series('sprite'))
});

gulp.task('default', gulp.series(
    gulp.parallel('pug', 'stylus', 'scripts', 'fonts', 'img:dev'),
    gulp.parallel('watch', 'serve'),
    
));

gulp.task('build', gulp.series(
    'pug',
    'stylus',
    'scripts',
    'fonts',
    'img:build',
    'sprite'
));