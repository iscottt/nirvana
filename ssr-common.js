
var show_post_list = (query_result)=>{
	var home_url = get_option('nv_home_url',"");
	return `<ul class="article-list">` + query_result
	.data.map(post=>{
		var thumbnail_url = get_post_meta(post.id,"_nv_thumbnail");
		return `<li><a href="${home_url}/${post.slug}">
			<span class="article-info">
				<h4>${post.title}</h4>
				<span class="date">${parse_date(post.modified_time)}</span>
			</span>
			${thumbnail_url ? `<img src='${thumbnail_url}' />` : ""}
			</a></li>`;
	})
	.join('')
	+ `</ul>`
}

var show_category_menu = ()=>{
	var home_url = get_option('nv_home_url',"");
	var cat = query_terms({
		taxonomy: 'category',
	}).map(cat=>{
		return `<li><a href="${home_url}/category/${cat.slug}">${cat.name}</a></li>`
	})
	.join('');
	return `<nav class="category-nav"><ul>
		<li><a href="${home_url}/" rel="home">首页</a></li>
		<li><a href="${home_url}/articles">全部文章</a></li>
		${cat}
		</ul></nav>`;
}

var parse_image_url = url=>{
	if (!url) {return url}
	if (url.substr(0,4) == "http" || url.substr(0,2) == "//") {
		return url;
	} else {
		return get_option('nv_home_url',"") + url;
	}
}

var parse_date = timestamp => {
　　var timestr = new Date(timestamp);
　　var year = timestr.getFullYear();
　　var month = timestr.getMonth()+1;
　　var date = timestr.getDate();
	return `${year}-${month}-${date}`;
}



module.exports = {show_post_list, show_category_menu, parse_image_url, parse_date}