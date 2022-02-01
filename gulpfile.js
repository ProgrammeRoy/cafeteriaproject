//Impotar dependencia de gulp a este archivo las llaves ({ }) quiere decir que importa multiples funciones, cuando importe solo una no se coloca

const { src, dest, watch, series } = require('gulp');
//src y dest son funciones de gulp

//CSS y SASS
const sass = require('gulp-sass')(require('sass'));
//sass es una funcion de sass

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

//Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//done es necesario para declarar el cierre
function buildCss(done) {

    //1. Identificar archivo sass (src), 2. Compilar (pipe(sass)), 3. Guardar el .css (pipe(dest...))
    src('src/scss/app.scss')
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(dest('build/css'))
        //Con outputStyle,defino el formato del css generado. Compress sirve para minificarlo y ocupe menos espacio, mientras que Expanded lo hace más legible.

    done(); // se coloca para indicarle que debe terminar la tarea
}

function myimages() {
    return src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3 }))
        .pipe(dest('build/img'));
}

function convertWebp() {
    const partialQuality = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp(partialQuality))
        .pipe(dest('build/img'))
}

function convertAvif() {
    const partialQuality = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif(partialQuality))
        .pipe(dest('build/img'))
}

function changeCss() {
    //Revisa los cambios en la direccion y ejecuta la funcion buildCss
    watch('src/scss/**/*.scss', buildCss)
    watch('src/img/**/*', myimages)
}

function taskDefault() {
    console.log("Soy la tarea por default");
}

exports.compiledCss = buildCss;
exports.updateCss = changeCss;
exports.loadimages = myimages;
exports.versionWebp = convertWebp;
exports.versionAvif = convertAvif;
exports.default = series(myimages, convertWebp, convertAvif, buildCss, changeCss);