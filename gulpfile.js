const gulp = require('gulp');

const babel = require('gulp-babel');
const watch = require('gulp-watch');

gulp.task('build', () =>
  gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'es2017',],
      plugins: ['transform-runtime',],
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('watch', () =>
  watch('src/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'es2017',],
      plugins: ['transform-runtime',],
    }))
    .pipe(gulp.dest('dist'))
);
