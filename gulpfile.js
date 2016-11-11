"use strict";
var gulp = require("gulp");
var del = require("del");
var sourcemaps = require('gulp-sourcemaps');

/**
 * Remove build directory.
 */
gulp.task('clean', function (cb) {
    return del(["client/build"], cb);
});

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("resources", ["client/server", "client/app", "client/assets"], function () {
    console.log("Building resources...");
});
/* copy the app core files to the build folder */
gulp.task("app", ['client/index'], function(){
    return gulp.src(["client/app/**", "client/!app/**/*.ts"])
        .pipe(gulp.dest("client/build/app"));
});
/* get the index file to the root of the build */
gulp.task("index", function(){
    return gulp.src(["client/index.html"])
        .pipe(gulp.dest("client/build"));
});
/* copy node server to build folder */
gulp.task("server", function () {
    return gulp.src(["client/index.js", "client/package.json"], { cwd: "client/server/**" })
        .pipe(gulp.dest("client/build"));
});
/* styles and other assets */
gulp.task("assets", function(){
    return gulp.src(["client/styles.css"])
        .pipe(gulp.dest("client/build"));
});
/**
 * Copy all required libraries into build directory.
 */
gulp.task("libs", function () {
    return gulp.src([
        'client/es6-shim/es6-shim.min.js',
        'client/systemjs/dist/system-polyfills.js',
        'client/angular2/bundles/angular2-polyfills.js',
        'client/angular2/es6/dev/src/testing/shims_for_IE.js',
        'client/systemjs/dist/system.src.js',
        'client/rxjs/bundles/Rx.js',
        'client/angular2/bundles/angular2.dev.js',
        'client/angular2/bundles/router.dev.js'
    ], { cwd: "client/node_modules/**" }) /* Glob required here. */
        .pipe(gulp.dest("client/build/node_modules"));
});
/**
 * Build the project.
 */
gulp.task("default", ['client/resources', 'client/libs'], function () {
    console.log("Building the project ...");
});
