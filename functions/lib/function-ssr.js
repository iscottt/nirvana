var path = require('path')
var fs = require('fs')

nv_render_assistant({
  rendering_mode: 'SSR',
  root_folder: get_theme_path('./web/'),
  template: {
    head: (req, route_name) => `<!DOCTYPE html><html lang="zh-cn"><head>${nv_head(req, route_name)}</head><body><div id="app">`,
    foot: (req, route_name) => `</div></body></html>`,
  },

  routes: [
    { name: 'home', path: '/' },
    { name: 'sitemap', path: '/sitemap.xml', type: 'text/xml' },
    { name: 'articles', path: '/articles' },
    { name: 'articles_paged', path: '/articles/page/:current_page' },
    { name: 'post', path: '/:post_slug' },
    { name: 'post_comment_paged', path: '/:post_slug/comment-page-:comment_page' },
    { name: 'term', path: '/:taxonomy/:term_slug' },
    { name: 'term_paged', path: '/:taxonomy/:term_slug/page/:current_page' },
    { name: 'zfb_callback', path: '/zfb_callback', genaral_html: false },
    { name: '404', path: '*', status: 404 },
  ],
})

// 打包后的Vue脚本和样式，把字符串引入到Head
var theme_scripts_and_styles = fs.readFileSync(get_theme_path('./web/application.html'), { encoding: 'utf8' })
add_action(
  'nv_head',
  () => {
    nv_enqueue_script(`/config.js`, 'theme_config')
    nv_enqueue_head(theme_scripts_and_styles)
  },
  99
)

require('./ssr-head.js')
require('./ssr-body.js')
require('./ssr-blocks.js')
