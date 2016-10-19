# termdemo


##前台开发环境搭建

###安装依赖
- $ cd termdemo/webcontent
- $ npm install

###开发环境与编译

-在assets中进行开发，之后将代码编译、打包、压缩到public
-样式文件使用scss进行预编译，编译压缩至public/css
  1.$ cd termdemo/webcontent/assets
  2.$ sass --watch sass:../public/css --style compressed  --sourcemap=none
-对于没有使用webpack打包的js文件，使用gulp压缩至public
  1.$ cd termdemo/webcontent
  2.$gulp jsmin
