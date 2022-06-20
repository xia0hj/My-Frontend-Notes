# webpack 笔记

## webpack

```bash
# 安装
npm i -D webpack webpack-cli

# 运行，默认使用当前目录下的 webpack.config.js，可通过 --config 指定使用开发环境和生产环境不同的配置
npx webpack --config webpack.dev.js

# 让 webpack 能够识别读取 .css 文件，解析 css 文件得到一个数组存放处理后的样式字符串
npm i -D css-loader

# 将解析后的 css 以标签 style 的形式插入到 HTML 中，需要先经过 css-loader 解析
npm i -D style-loader

# webpack 通过 babel 来解析 .js 文件，会转换去除箭头函数等 es6 语法
npm i -D babel-loader

# 将图片转换成一个 DataURL，然后打包到 JavaScript 代码中
npm i -D url-loader

# webpack 用于解析 eslint 的插件
npm i -D eslint-webpack-plugin

# 将打包得到的 js 等资源，如 entry 指定的输出文件，以 script 标签插入到指定的 html 中
npm i -D html-webpack-plugin

# 开发服务器，监听代码文件自动在内存中打包，实时更新页面，不会保存到 dist
# 运行命令 npx webpack serve
npm i -D webpack-dev-server
```

1. 配置文件示例 [webpack.config.js](./webpack.config.js)

## eslint

```bash
# eslint 核心依赖
npm i -D eslint

# eslint 不支持部分由 babel 提供的语法，需要在 .eslintrc.js 中配置使用该解析器
npm i -D babel-eslint
```

1. 配置文件示例 [.eslintrc.js](./.eslintrc.js)
2. vscode 的 eslint 插件会自动根据配置文件实时检查文件格式，但它会检查整个项目而不仅是 src 文件夹，可以新增忽略文件 .eslintignore

## babel

```bash
# babel 核心依赖
npm i -D @babel/core

# 常用的预设一系列 babel 插件
npm i -D @babel/preset-env
```

## webpack-dev-server 开发

1. `npm i -D webpack webpack-cli webpack-dev-server html-webpack-plugin`

2. webpack.config.js 中配置 `entry，output，plugin，devServer，mode，devtool='eval-source-map'`

3. 在 chrome devtool 中直接打断点
