var gulp = require('gulp'),
	sass = require('gulp-sass'),
    minify = require('gulp-minify'),
	sourcemaps = require('gulp-sourcemaps'),
	del = require('del'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	browserSync = require('browser-sync').create(),
	browserify = require('browserify'),
    reload = browserSync.reload,
    ENV = require('./env.js');

var paths = {
    jsSource: [
        './build/js/star-wars-quiz.js',
        './build/js/app.js',
    ],
    cssSource: [
        './build/sass/styles.scss'
    ],
    jsPath: './build/js/**.js',
    cssPath: './build/sass/**.scss',
    dist: './dist/'
};

gulp.task('del-js', function() {
    del(['./dist/js/**.js']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
})

gulp.task('del-css', function() {
    del(['./dist/css/**']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
})

gulp.task('move-image', function() {
    gulp.src('./build/img/**')
    .pipe(gulp.dest(paths.dist + 'img'))
})

gulp.task('minify-js',['del-js'], () => {
    gulp.src(paths.jsSource)
    .pipe(minify({
        ext: {
            src: '.js',
            min: '-min.js'
        }
    }))
    .pipe(gulp.dest(paths.dist + 'js'));
});

// transform sass in css and minify
gulp.task('sass', ['del-css'], function(){
    return gulp.src(paths.cssSource)
    .pipe(sass({outputStyle: 'compressed'})
    .on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist + 'css'))
    .pipe(browserSync.stream());
});

// task to auto update page without manual refresh
gulp.task('bw-sync', ['sass', 'minify-js', 'move-image'], function(){
    browserSync.init({
        server: {
            proxy: ENV.host
        },
        open: false
    });

    gulp.watch(paths.cssPath, ['sass'])
    gulp.watch(paths.jsPath, ['minify-js'])
    gulp.watch(['./*.html', './**.php']).on('change', reload);
});

gulp.task('default', ['sass', 'minify-js', 'move-image']);