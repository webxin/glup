var gulp=require("gulp");
var sass=require("gulp-sass");
var browserSync=require("browser-sync");
var useref = require("gulp-useref");
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

//dev 
gulp.task("watch",["browserSync","sass"],function(){
    gulp.watch("app/scss/**/*.scss",["sass"]);
    gulp.watch('app/*.html',browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
})
//product 
gulp.task("build",function(callback){
    runSequence("clean",["sass","useref","images","copyjsLib","copycssLib"],callback)
})

gulp.task("sass",function(){
   return   gulp.src("app/scss/**/*.scss")
   .pipe(sass())
   .pipe(gulp.dest("app/css"))
   .pipe(browserSync.reload({
        stream:true
   }))
})
//copy files
gulp.task("copyjsLib",function(){
    return gulp.src("app/js/lib/**/*.js")
    .pipe(gulp.dest("dist/js/lib"))
})
gulp.task("copycssLib",function(){
    return gulp.src("app/css/lib/**/*.css")
    .pipe(gulp.dest("dist/css/lib"))
})
//browser update
gulp.task("browserSync",function(){
    browserSync({
        server:{
            baseDir:"app"
        }
    })
})
//combine and uglify(css|js)
gulp.task("useref",function(){
    return gulp.src("app/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", minifyCSS()))
    .pipe(gulp.dest("dist"));
})
//uglify js
gulp.task("uglify",function(){
    return gulp.src('app/js/*.js')
     .pipe(uglify())
     .pipe(gulp.dest('dist/js'));
})
//uglify css
gulp.task("minifyCSS",function(){
    return gulp.src('app/css/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'));
})

//uglify images
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced: true
  })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('clean:dist', function(callback) {
  del(['dist/**/*','!dist/images','!dist/images/**/*'],callback);
});

//delete dist
gulp.task('clean', function() {
  del('dist/*');
});