var {show_post_list, show_category_menu, parse_image_url} = require('./ssr-common.js');

var get_footer = ()=>{
	var copyright = get_option("niRvana_copyright", "PANDA Studio - nvPress")
	var links = get_option('niRvana_footer_links',[]).map(item=>{
		return `<a href="${item.url}" target="_blank" rel="noopener noreferrer nofollow">
		${item.image ? `<img src="${item.image}" />` : ''}
		${item.text}
		</a>`;
	}).join('');
	return `<footer>
				${copyright}
				${links ? `<div class="links">${links}</div>` : ''}
			</footer>`;
}

add_action('async:nv_render:home',(next,{echo,req,route})=>{
	var site_name = get_option('nv_site_name','nvPress');
	var site_description = get_option('nv_site_description','');
	var copyright = get_option("niRvana_copyright", "PANDA Studio - nvPress")
	echo(`
		<div class="home ssr-body">
			<div class="banner">
				<h1>${site_name}</h1>
				<p>${site_description}</p>
				${show_category_menu()}
			</div>
			<div class="wrapper">
				<div class="main">
					<h3>近期文章</h3>
					${show_post_list( query_posts({ post_type: 'article' }) )}
				</div>
				<aside>
					<h4>随机文章</h4>
					${show_post_list( query_posts( { post_type: 'article', orderby: 'rand'} ) )}
				</aside>
			</div>
			${get_footer()}
		</div>
		`);
	next();
})


var render_articles = (next,{echo,req,route})=>{
	var current_page = parseInt(req.params.current_page) || 1;
	var site_name = get_option('nv_site_name','nvPress');
	var site_description = get_option('nv_site_description','');
	var copyright = get_option("niRvana_copyright", "PANDA Studio - nvPress")
	var main_posts = query_posts({
					post_type: 'article',
					status: 'publish',
					current_page,
					posts_per_page: get_option('niRvana_posts_per_page',10)
				});
	var {posts_per_page, total} = main_posts.pagination;
	var show_pagination = ({posts_per_page, total, current_page})=>{
		var home_url = get_option('nv_home_url',"");
		var result = "";
		if (current_page > 1) {
			if (current_page == 2) {
				result += `<a rel="prev" href="${home_url}/articles">上一页</a>`
			} else {
				result += `<a rel="prev" href="${home_url}/articles/page/${current_page-1}">上一页</a>`
			}
		}
		if (current_page < Math.ceil( total / posts_per_page ) ) {
			result += `<a rel="next" href="${home_url}/articles/page/${current_page+1}">下一页</a>`
		}
		return result;
	}
	echo(`
		<div class="articles ssr-body">
			<div class="banner">
				<h1>全部文章</h1>
				<p>您当前浏览的是全站文章列表，目前站内共${total}篇文章，每页${posts_per_page}篇</p>
				${show_category_menu()}
			</div>
			<div class="wrapper">
				<div class="main">
				${show_post_list( main_posts )}
				${show_pagination({posts_per_page, total, current_page})}
				</div>
				<aside>
					<h4>随机文章</h4>
					${show_post_list( query_posts( { post_type: 'article', orderby: 'rand'} ) )}
				</aside>
			</div>
			${get_footer()}
		</div>
		`);
	next();
}
add_action('async:nv_render:articles', render_articles);
add_action('async:nv_render:articles_paged', render_articles);

var render_term = (next,{echo,req,route})=>{
	if (!['term','term_paged'].includes(route.name)) {return;}

	var term_slug = req.params.term_slug;
	var taxonomy = req.params.taxonomy;
	var current_page = parseInt(req.params.current_page) || 1;

	var term_id = term_exists(term_slug, taxonomy);
	if (!term_id) {
		route.status = 404;
		render_404(next,{echo,req,route});
		return;
	}

	var term = nvdb.terms.find(r=>r.id == term_id)[0];
	var main_posts = query_posts({
					post_type: 'article',
					status: 'publish',
					tax_query: {
						opts: [{
							taxonomy,
							terms: [term_id],
						}]
					},
					current_page,
					posts_per_page: get_option('niRvana_posts_per_page',10)
				});
	var {posts_per_page, total} = main_posts.pagination;
	var show_pagination = ({posts_per_page, total, current_page})=>{
		var home_url = get_option('nv_home_url',"");
		var result = "";
		if (current_page > 1) {
			if (current_page == 2) {
				result += `<a rel="prev" href="${home_url}/${taxonomy}/${term_slug}">上一页</a>`
			} else {
				result += `<a rel="prev" href="${home_url}/${taxonomy}/${term_slug}/page/${current_page-1}">上一页</a>`
			}
		}
		if (current_page < Math.ceil( total / posts_per_page ) ) {
			result += `<a rel="next" href="${home_url}/${taxonomy}/${term_slug}/page/${current_page+1}">下一页</a>`
		}
		return result;
	}
	echo(`
		<div class="term ssr-body">
			<div class="banner">
				<h1>文章分类：${term.name}</h1>
				<p>您当前浏览的分类是：${term.name}，该分类共${total}篇文章，每页${posts_per_page}篇</p>
				${show_category_menu()}
			</div>
			<div class="wrapper">
				<div class="main">
				${show_post_list( main_posts )}
				${show_pagination({posts_per_page, total, current_page})}
				</div>
				<aside>
					<h4>最新文章</h4>
					${show_post_list( query_posts( { post_type: 'article' } ) )}
				</aside>
			</div>
			${get_footer()}
		</div>
		`);
	next();
}
add_action('async:nv_render:term', render_term);
add_action('async:nv_render:term_paged', render_term);


var render_post = (next,{echo,req,route}) => {
	var post_slug = encodeURIComponent(decodeURIComponent(req.params.post_slug));
	var post = get_post(post_slug);
	if ( is_nv_error(post) ) {
		route.status = 404;
		render_404(next,{echo,req,route});
		return;
	}
	if ( post.status !== "publish" || post.modified_time > new Date().getTime() ) {
		route.status = 404;
		render_404(next,{echo,req,route});
		return;
	}

	var description = esc_html(strip_tags(
		post.excerpt
		? post.excerpt
		: post.content.blocks
			.filter(block=>block.type == 'paragraph')
			.map(block=>block.data.text)
			.join('')
			.substr(0,160)
		));

	var home_url = get_option('nv_home_url',"");

	var thumbnail_url = get_post_meta(post.id,"_nv_thumbnail");
	var image_dom = thumbnail_url ? `<img src="${parse_image_url(thumbnail_url)}" alt="thumbnail" style="float:right;width:256px;" />` : "";

	var post_taxonomies = {};
	var generate_post_taxonomies = (post) =>{
		var id = post.id;
		//读取这个post对应posttype所注册的所有taxonomy
		var post_taxs = get_taxonomies(post.post_type);
		var taxonomies = { /*taxonomyName: [term]*/ }
		post_taxs.forEach(tax=>{
			var terms = nv_get_object_terms(id, tax.taxonomy);
			taxonomies[tax.taxonomy] = terms;
		})
		post_taxonomies = taxonomies;
	}
	generate_post_taxonomies(post);

	var show_taxonomies = (home_url)=>{
		var result = "";
		// 页面没有分类和Tag
		post_taxonomies.category && post_taxonomies.category.map(term=>{
			result += `<li><a href="${home_url}/category/${term.slug}">${term.name}</a></li>`
		})
		post_taxonomies.tag && post_taxonomies.tag.map(term=>{
			result += `<li><a href="${home_url}/tag/${term.slug}">${term.name}</a></li>`
		})
		return result;
	}

	var show_relate_list = (post,home_url)=>{
		if (!post_taxonomies.category || !post_taxonomies.tag) {
			// 页面没有相关文章
			return "";
		}
		var id = post.id;
		var categoryIDs = post_taxonomies.category.map(term=>term.id);
		var tagIDs = post_taxonomies.tag.map(term=>term.id);

		var posts = query_posts({
			post_type: 'article',
			status: 'publish',
			post_not_in: [id],
			tax_query: {
				relation: 'OR',
				opts: [{
					taxonomy: 'category',
					terms: categoryIDs,
					operator: 'IN'
				},{
					taxonomy: 'tag',
					terms: tagIDs,
					operator: 'IN'
				}]
			},
			orderby: 'rand',
			posts_per_page: 4
		});
		return posts.data.map(post=>{
			var thumbnail_url = get_post_meta(post.id,"_nv_thumbnail");
			return `<li><a href="${home_url}/${post.slug}"><h5>${post.title}</h5> ${thumbnail_url ? `<img src='${parse_image_url(thumbnail_url)}' />` : ""}</a></li>`;
		}).join('');
	}

	async_get_the_content(post)
	.then((content)=>{
		echo(`
			<div class="term ssr-body">
				<div class="banner">
					<h1>${post.title}</h1>
					<p>${description}</p>
					${show_category_menu()}
				</div>
				<div class="wrapper">
					<div class="main">
						<article class="post-wrapper">
						${image_dom}
						${content}
						</article>
					</div>
					<aside>
						<h4>标签与分类</h4>
						<ul class="term-list">${show_taxonomies(home_url)}</ul>
						<h4>相关文章</h4>
						<ul class="article-list">${show_relate_list(post,home_url)}</ul>
					</aside>
				</div>
				${get_footer()}
			</div>
			`);
		next();
	})
}
add_action('async:nv_render:post', render_post);
add_action('async:nv_render:post_comment_paged', render_post);


var render_404 = (next,{echo,req,route}) => {
	echo(`<div class="four04 ssr-body">
			<div class="banner">
				<h1>404</h1>
				<p>404 not found</p>
				${show_category_menu()}
			</div>
			<div class="wrapper">
				<p>您访问的页面不存在</p>
			</div>
			${get_footer()}
		</div>`)
	next();
}
add_action('async:nv_render:404', render_404);

// sitemap
var sitemap_parse_modified_time = (modified_time)=>{
	var date = new Date(modified_time);

	var DD = String(date.getDate()).padStart(2, '0');
	var MM = String(date.getMonth() + 1).padStart(2, '0');
	var yyyy = date.getFullYear();

	return `${yyyy}-${MM}-${DD}`;
}

var sitemap_last_generate = 0;
var sitemap_last_info = "";

var sitemap_get_post_info = ()=>{
	var now = new Date().getTime();
	if (now - sitemap_last_generate > 86400000) {
		sitemap_last_generate = now;
		sitemap_last_info = ""; 
		var posts = query_posts({
			post_type: "article",
			status: "publish",
			posts_per_page: 999,
		});
		var home_url = get_option('nv_home_url','');
		
		posts.data.forEach(post=>{
			sitemap_last_info += `<url>`;
			sitemap_last_info += `<loc>${home_url}/${post.slug}</loc>`
			sitemap_last_info += `<lastmod>${ sitemap_parse_modified_time(post.modified_time) }</lastmod>`
			sitemap_last_info += `<changefreq>weekly</changefreq>`
			sitemap_last_info += `<priority>1.0</priority>`
			sitemap_last_info += `</url>`
		})
	}
	return sitemap_last_info;
}

add_action('async:nv_render:sitemap', ( next,{echo,req,route} )=>{
	echo(`<?xml version="1.0" encoding="utf-8"?>`)
	echo(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`)
	echo( sitemap_get_post_info() );
	echo(`</urlset>`)
	next();
});