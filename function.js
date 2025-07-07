import * as fs from 'fs'
import { pathToFileURL } from 'url'
// 用户自定义function：在主题根目录新建 custom_functions.js 文件，重启后自动引入
var custom_function_file = get_theme_path('./custom_functions.js')
if (fs.existsSync(custom_function_file)) {
  await import(pathToFileURL(custom_function_file))
}

// 主题的后端程序
// var theme_function_file = get_theme_path('./backend.min.cjs');
var theme_function_file = get_theme_path('./functions/lib/function.js')
if (fs.existsSync(theme_function_file)) {
  await import(pathToFileURL(theme_function_file))
} else {
  console.log('主题模式：\x1B[31m\x1B[1m开发模式\x1B[0m')
  await import('./backend-esm/entry.js')
}
