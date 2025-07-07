
var async_render_blocks = (blocks, post)=>{
	async function fn() {
		var result_content = "";
		for (var i = 0; i < blocks.length; i++) {
			var block = blocks[i];
			var block_data = await apply_async_filters(`async:render_block:${block.type}`,"", block, post);
			result_content += block_data;
		}
		return result_content;
	}
	return fn();
}

add_filter(`async:render_block:pandastudio/tip`,async (next, last_filtered, {data}, post)=>{
	var result = `<div class="pandastudio-tip"><p>${data.title}</p>`;
	if (typeof(data.text) == 'string') {
		result += `<p>${data.text}</p>`;
	} else {
		result += await async_render_blocks(data.text.blocks, post);
	}
	result += `</div>`;
	next(result);
})

add_filter(`async:render_block:pandastudio/collapse`,async (next, last_filtered, {data}, post)=>{
	var result = `<details class="pandastudio-collapse"><summary>${data.title}</summary>`;
	result += await async_render_blocks(data.content.blocks, post);
	result += `</details>`;
	next(result);
})

add_filter(`async:render_block:pandastudio/title`,async (next, last_filtered, {data}, post)=>{
	next(`<${data.tag} class="pandastudio-title">${data.text}</${data.tag}>`);
})

add_filter(`async:render_block:pandastudio/columns`,async (next, last_filtered, {data}, post)=>{
	var result = `<div class="pandastudio-columns">`;
	for (var i = 0; i < data.columns.length; i++) {
		var col = data.columns[i];
		result += `<div>`;
		result += await async_render_blocks(col.content.blocks, post);
		result += `</div>`;
	}
	result += `</div>`;
	next(result);
})

add_filter(`async:render_block:pandastudio/panel`,async (next, last_filtered, {data}, post)=>{
	var result = `<div class="pandastudio/panel"><p>${data.title}</p>`;
	result += await async_render_blocks(data.content.blocks, post);
	result += `</div>`;
	next(result);
})

add_filter(`async:render_block:pandastudio/download`,async (next, last_filtered, {data}, post)=>{
	var result = `<a>下载链接</a>`;
	data.links.forEach(link=>{
		result = `<a>${link.title}</a>`;
	})
	next(result);
})

add_filter(`async:render_block:pandastudio/gallery`,async (next, last_filtered, {data}, post)=>{
	var result = `<ul class="gallery">`;
	data.images.forEach(img=>{
		result += `<li><a href="${img.original}" target="_blank"><img src="${img.thumbnail || img.original}" /></a></li>`;
	})
	result += `</ul>`;
	next(result);
})

add_filter(`async:render_block:pandastudio/video`,async (next, last_filtered, {data}, post)=>{
	if (data.url) {
		next(`<video controls><source src="${data.url}" /></video>`)
	}
	else if (data.iframe) {
		next(data.iframe)
	}
	else {
		next("");
	}
})