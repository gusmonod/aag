const argv = require('yargs').argv;
const babel = require('gulp-babel');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');

gulp.task('build:server', () =>
  gulp.src('src/server/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'es2017',],
      plugins: ['transform-runtime',],
    }))
    .pipe(gulp.dest('dist/server'))
);

gulp.task('build:components', () =>
  browserify({
    entries: './src/components/app.jsx',
    extensions: ['.jsx',],
    debug: argv.production ? false : true,  // add resource map at the end of the file or not
  })
    .transform(babelify, {
      presets: ['es2015', 'es2017', 'react',],
    })
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(gulpif(argv.production, buffer()))  // Stream files
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest('public/js'))
);

gulp.task('build', ['build:server', 'build:components',]);

gulp.task('watch:server', ['build:server',], () =>
  gulp.watch('src/server/**/*.js', ['build',])
);

gulp.task('watch:components', ['build:components',], () =>
  gulp.watch('src/components/**/*.jsx', ['build:components',])
);

gulp.task('watch', ['watch:server', 'watch:components',]);
