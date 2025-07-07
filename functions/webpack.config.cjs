'use strict'
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  target: 'node',
  //入口
  entry: './lib/function.js',
  //出口
  output: {
    path: path.resolve(__dirname, '../'), //这里要写绝对路径，要动态获取路径
    filename: 'backend.min.cjs',
    libraryTarget: 'commonjs2', // 指定输出为 CommonJS 格式,
    libraryExport: 'default',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
}
