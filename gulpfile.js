//dependencias necesarias
var gulp = require('gulp'),                     //gulp aplicación
    concat = require('gulp-concat'),            //para concatenar archivos
    prettify = require('gulp-jsbeautifier'),    //para formatear archivos
    uglify = require('gulp-uglify'),            //para comprimir js
    minify = require('gulp-minify-css'),        //para minificar css
    sourcemaps = require('gulp-sourcemaps'),    //para añadir sourcemaps a archivos comprimidos por uglify
    gutil = require('gulp-util');               //para recoger parámetros por gulp


gulp.task("watch", function () {
    gulp.watch('./jquery-vTag.js', ['ujs']);
});

gulp.task("ujs", function () {
    return gulp.src(['./jquery-vTag.js'])
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(concat('jquery-vTag.min.js'))
      .pipe(gulp.dest("./"));
}); 
