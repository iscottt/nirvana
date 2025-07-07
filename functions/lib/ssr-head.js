var { parse_image_url, parse_date } = require('./ssr-common.js')

// 生成 name、description、image标签的方法
var generate_head = ({ title, description, image }) => {
  // name 相关
  nv_enqueue_head(`
		<title>${title}</title>
		<meta itemprop="name" content="${title}" />
		`)

  // description 相关
  nv_enqueue_head(`
		<meta description="${description}" />
		<meta name="description" itemprop="description" content="${description}" />
		`)

  // image相关
  var logo = parse_image_url(get_option('niRvana_logo_url'))
  var favicon = parse_image_url(get_option('niRvana_favicon_32'))
  var apple_touch_icon = parse_image_url(get_option('niRvana_apple_touch_icon'))
  nv_enqueue_head(`
		<meta itemprop="image" content="${image || apple_touch_icon || favicon || logo}" />
		`)
  if (favicon) {
    nv_enqueue_head(`
		<link rel="shortcut icon" href="${favicon}" sizes="32x32">
		`)
  }
  if (apple_touch_icon) {
    nv_enqueue_head(`
		<link rel="apple-touch-icon" href="${apple_touch_icon}">
		`)
  }
}

add_action(
  'nv_head',
  (req, route) => {
    // 通用的
    nv_enqueue_head(`
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,viewport-fit=cover" />
		`)
    // niRvana的自定义head
    var custom_head = get_option('niRvana_custom_head', '')
    if (custom_head) {
      nv_enqueue_head(custom_head)
    }
  },
  -1
)

add_action(
  'nv_head',
  (req, route) => {
    // SSR样式，位置放在后面一点
    nv_enqueue_style(`/srcs/ssr-style.css`, 'ssr-style', 1.0)
  },
  999
)

add_action('nv_head', (req, route) => {
  if (route.name !== 'home') {
    return
  }
  var site_name = get_option('nv_site_name', 'nvPress')

  var title = esc_html(strip_tags(site_name))
  var description = esc_html(strip_tags(`欢迎访问 ${site_name}，${get_option('nv_site_description', '')}`))

  generate_head({ title, description })
})

add_action('nv_head', (req, route) => {
  if (!['articles', 'articles_paged'].includes(route.name)) {
    return
  }
  var site_name = get_option('nv_site_name', 'nvPress')
  var current_page = parseInt(req.params.current_page) || 1

  var title = `全部文章${current_page > 1 ? ` - 第${req.params.current_page}页` : ''} - ${site_name}`
  var description = esc_html(strip_tags(`欢迎访问 ${site_name}，您当前浏览的是全站文章列表`))

  generate_head({ title, description })
})

add_action('nv_head', (req, route) => {
  if (!['post', 'post_comment_paged'].includes(route.name)) {
    return
  }

  var post_slug = encodeURIComponent(decodeURIComponent(req.params.post_slug))
  var post = get_post(post_slug)
  if (is_nv_error(post)) {
    route.status = 404
    four04_head()
    return
  }
  if (post.status !== 'publish' || post.modified_time > new Date().getTime()) {
    route.status = 404
    four04_head()
    return
  }

  var site_name = get_option('nv_site_name', 'nvPress')

  var title = `${esc_html(strip_tags(post.title))} - ${site_name}`
  var description = esc_html(
    strip_tags(
      post.excerpt
        ? post.excerpt
        : post.content.blocks
            .filter(block => block.type == 'paragraph')
            .map(block => block.data.text)
            .join('')
            .substr(0, 160)
    )
  )
  var image = get_post_meta(post.id, '_nv_thumbnail')
  generate_head({ title, description, image })
  var home_url = get_option('nv_home_url', '')
  nv_enqueue_head(`
		<meta name="Author" content="${site_name}" />
		<meta name="Owner" content="${site_name}" />
		<meta property="og:type" content="article"/>
		<meta property="og:locale" content="zh-CN"/>
		<meta property="og:site_name" content="${site_name}"/>
		<meta property="og:title" content="${post.title}"/>
		<meta property="og:description" content="${description}"/>
		<meta property="og:url" content="${home_url + '/' + post.slug}"/>
		<meta property="og:image" content="${parse_image_url(image)}"/>
		<meta property="og:release_date" content="${parse_date(post.created_time)}"/>
		<meta property="article:author" content="${site_name}"/>
		<meta property="article:published_first" content="${site_name},${home_url + '/' + post.slug}"/>
		<link rel="canonical" href="${home_url + '/' + post.slug}" />
	`)
})

add_action('nv_head', (req, route) => {
  if (!['term', 'term_paged'].includes(route.name)) {
    return
  }

  var term_slug = req.params.term_slug
  var taxonomy = req.params.taxonomy
  var current_page = parseInt(req.params.current_page) || 1

  var term_id = term_exists(term_slug, taxonomy)
  if (!term_id) {
    route.status = 404
    four04_head()
    return
  }

  var term = nvdb.terms.find(r => r.id == term_id)[0]

  var site_name = get_option('nv_site_name', 'nvPress')

  var title = `${term.name}${current_page > 1 ? ` - 第${req.params.current_page}页` : ''} - ${site_name}`
  var description = esc_html(strip_tags(`欢迎光临${site_name}，您当前浏览的分类是：${term.name}`))
  generate_head({ title, description })
})

// 404，其他路由也可以直接调用
var four04_head = () => {
  var site_name = get_option('nv_site_name', 'nvPress')

  var title = `404 - ${site_name}`
  var description = esc_html(strip_tags(`欢迎访问 ${site_name}，${get_option('nv_site_description', '')}`))

  generate_head({ title, description })
}
add_action('nv_head', (req, route) => {
  if (route.name !== '404') {
    return
  }
  four04_head()
})
