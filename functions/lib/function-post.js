// 列表页相关
var path = require('path');
var fs = require('fs');

register_rest_route('nirvana','relate-post',{
	methods: 'post',
	callback(data,req) {
		var {id,categoryIDs,tagIDs} = data;
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
		return posts.data.map(post=>nirvana_lite_post(post));
	}
});

register_rest_route('nirvana','post-like',{
	methods: 'post',
	callback(data,req) {
		var {id} = data;
		var likes = get_post_meta(id,'likes') || 0;
		likes = parseInt(likes+1) || 1;
		update_post_meta(id,'likes',likes);
		return likes;
	}
});

register_rest_route('nirvana','post-view',{
	methods: 'post',
	callback(data,req) {
		var {id} = data;
		var views = get_post_meta(id,'views') || 0;
		views = parseInt(views+1) || 1;
		update_post_meta(id,'views',views);
		return views;
	}
});