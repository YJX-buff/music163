// 引入包资源
const gulp = require('gulp')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')(require('sass'))
const htmlmin = require('gulp-htmlmin')
const connect = require('gulp-connect')
const { createProxyMiddleware } = require('http-proxy-middleware')
const del = require('del')

// 定义变量，保存各种资源的路径
const paths = {
  js: {
    src: 'src/js/**/*.js', // js 文件的源路径
    dest: 'dist/js' // js 处理后的目标路径
  },
  css: {
    src: 'src/css/**/*.css',
    dest: 'dist/css'
  },
  scss: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css'
  },
  html: {
    src: 'src/**/*.html',
    dest: 'dist'
  },
  libs: {
    src: 'src/libs/**/*.*',
    dest: 'dist/libs'
  },
  objectImg: {
    src: 'src/object_img/**/*.*',
    dest: 'dist/object_img'
  },
  shopImg: {
    src: 'src/shop_img/**/*.*',
    dest: 'dist/shop_img'
  },
  shopcartImg: {
    src: 'src/shopcart_img/**/*.*',
    dest: 'dist/shopcart_img'
  },
  mock: {
    src: 'src/mock/**/*.*',
    dest: 'dist/mock'
  },
}

// 定义任务函数：处理 JS 资源
function scripts() {
  return gulp.src(paths.js.src)
    .pipe(babel({
			presets: ['env']
		}))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(connect.reload())
}

// 处理 CSS
function styles() {
  return gulp.src(paths.css.src)
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.css.dest))
    .pipe(connect.reload())
}

// 编译 sass 文件
function buildScss() {
  return gulp.src(paths.scss.src)
    .pipe(sass())
    // .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(connect.reload())
}

// html文件处理
function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(connect.reload())
}

// 定义监视任务
function watch() {
  gulp.watch(paths.scss.src, buildScss)
  gulp.watch(paths.js.src, scripts)
  gulp.watch(paths.css.src, styles)
  gulp.watch(paths.html.src, html)
}

// 清理 dist 目录
function clean() {
  return del([ 'dist' ])
}

// 复制无需特殊处理的资源
function copyLibs() {
  return gulp.src(paths.libs.src)
    .pipe(gulp.dest(paths.libs.dest))
}
function copyMock() {
  return gulp.src(paths.mock.src)
    .pipe(gulp.dest(paths.mock.dest))
}
function copyObjectImg() {
  return gulp.src(paths.objectImg.src)
    .pipe(gulp.dest(paths.objectImg.dest))
}
function copyShopImg() {
  return gulp.src(paths.shopImg.src)
    .pipe(gulp.dest(paths.shopImg.dest))
}
function copyShopcartImg() {
  return gulp.src(paths.shopcartImg.src)
    .pipe(gulp.dest(paths.shopcartImg.dest))
}

// 启动 webserver 服务器
function server() {
  connect.server({
    root: 'dist',
    port: 9527,
    livereload: true,
    middleware: () => {
      return [
        // /163/store/api/searchsuggest/get
        // 完整地址：https://music.163.com/163/store/api/searchsuggest/get
        // 真实接口：https://music.163.com/store/api/searchsuggest/get
        createProxyMiddleware('/163', {
          target: 'https://music.163.com', // 代理的目标服务器
          changeOrigin: true, // 跨域
          pathRewrite: {
            '^/163': '',
          },
        }),
        createProxyMiddleware('/store', {
          target: 'https://music.163.com', // 代理的目标服务器
          changeOrigin: true, // 跨域
        })
      ]
    }
  })
}

// 形成处理流程
const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    scripts,
    buildScss,
    html,
    copyLibs,
    copyMock,
    copyObjectImg,
    copyShopImg,
    copyShopcartImg
  ),
  gulp.parallel(
    server,
    watch,
  )
)

// 导出任务
// exports.scripts = scripts
// exports.styles = styles
// exports.buildScss = buildScss
// exports.watch = watch
// exports.html = html
// exports.clean = clean
// exports.build = build
// exports.copyLibs = copyLibs
// exports.server = server

// 默认任务
exports.default = build
