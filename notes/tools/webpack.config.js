const path = require('path');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 入口文件
  entry: './src/main.js',
  // 输出
  output: {
    // 输出到 ./dist/output.js
    path: path.resolve(__dirname, 'dist'), 
    filename: 'output.js',
    clean: true // 自动将上次打包目录资源清空
  },
  // 加载器 loader
  module: {
    rules: [
      {
        test: /\.css$/, // 匹配以 .css 结尾的文件
        use: ['style-loader', 'css-loader'] // 对于 .css 文件，从右到左按需执行
      },
      {
        // npm i -D less less-loader
        test: /\.less$/, // 匹配以 .less 结尾的文件
        use: ['style-loader', 'css-loader', 'less-loader'] // 对于 .less 文件，还需要通过 less-loader 处理成普通 css
      },
      {
        // npm i -D sass sass-loader
        test: /\.s[ac]ss$/, // 匹配 .sass 或 .scss
        use: ['style-loader', 'css-loader', 'sass-loader'], 
      },
      {
        // 处理图片资源
        test: /\.(png|jpe?g|gif|webp)$/,
        type: 'asset', // 使用 webpack 内置的资源模块来加载
        // type: "asset/resource" 相当于 file-loader, 将文件转化成 Webpack 能识别的资源，其他不做处理
        // type: "asset" 相当于 url-loader, 将文件转化成 Webpack 能识别的资源，同时小于某个大小的资源会处理成 data URI 形式
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // // 小于10kb的图片会处理成 base64 字符串
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules代码不编译
        loader: 'babel-loader',
      },
    ],
  },
  // 插件
  plugins: [
    // 指定哪里的文件在打包时会应用 eslint 的规则
    new ESLintWebpackPlugin({context: path.resolve(__dirname, 'src')}), 
    // 将打包得到的 js 等资源，如 entry 指定的输出文件，以 script 标签插入到指定的 html 中
    new HtmlWebpackPlugin({template: path.resolve(__dirname, 'public/index.html')}) 
  ],
  // 开发服务器，监听代码文件自动在内存中打包，实时更新页面，不会保存到 dist
  devServer: {
    host: 'localhost', // 启动服务器域名
    port: '3000', // 启动服务器端口号
    open: true, // 是否自动打开浏览器
  },
  // 模式
  mode: 'development',
};