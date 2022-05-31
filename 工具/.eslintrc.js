module.exports = {
  parserOptions: {
    parser: 'babel-eslint', // eslint 不支持部分由 babel 提供的语法，需要该解析器
    ecmaVersion: 6, // ES 语法版本
    sourceType: 'module', // ES 模块化
    ecmaFeatures: { // ES 其他特性
      jsx: true // 如果是 React 项目，就需要开启 jsx 语法
    }
  },
  // 继承规则
  extends: [ ],
  // 具体规则，规则的值是数组，
  // 数组第一项 = off||warn||error；第二项是文档中的值
  rules: {
    'no-var': 'error', // 不能使用 var 定义变量
    'no-debugger': ['error'],
    quotes: ['warn', 'single'], // 单引号
    semi: ['warn', 'always'], // 分号
    eqeqeq: ['warn','smart'],
  },
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量
  },
};