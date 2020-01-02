# Web Management System Boilerplate (WIP)

The boilerplate based on [react](https://facebook.github.io/react), [redux](https://github.com/reactjs/redux), [react router](https://github.com/ReactTraining/react-router), [redux saga](https://github.com/redux-saga/redux-saga), [redux actions](https://github.com/acdlite/redux-actions), [webpack](https://webpack.js.org/), [nprogress](http://ricostacruz.com/nprogress/), [axios](https://github.com/mzabriskie/axios) for rapid project development

## Getting Started

```shell
# dev (Startup the dev server and the mock server.)
$ npm run dev

# build
$ npm run build

# mock server
$ npm run mock

# lint
$ npm run lint
```

## Configuration

```shell
$ open ./build.config.js
```

```js
const PORT = 8886;
const MOCK_PORT = 8887;

module.exports = {
  title: 'react-Temp',
  output: './dist',
  vendor: {
    // 打包到dll文件中，按需加载的模块不要写在这里
    modules: [
      '@babel/polyfill',
      '@loadable/component',
      'axios',
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'redux',
      'react-redux',
      'redux-saga',
      'redux-actions',
      'nprogress'
    ]
  },
  port: PORT,
  mockPort: MOCK_PORT,
  proxy: {
    // 以/api开头的请求代理到数据模拟服务
    '/api/*': {
      target: `http://localhost:${MOCK_PORT}/`,
      secure: false
    }
  }
}
```

## Theme

主题定制可以在theme.json中对样式变量进行修改，所有样式变量可以看[这里](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)
