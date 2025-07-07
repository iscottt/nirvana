<template>
	<div
	class="pandastudio-video"
	:class="{
		'align-left':data.align=='left',
		'align-center':data.align=='center',
		'align-right':data.align=='right',
		'align-full':data.align=='full',
		'is-video': data.url,
		'is-iframe': data.iframe,
	}"
	>
		<video :controls="data.controls" :autoplay="data.autoplay" :loop="data.loop" v-if="data.url">
			<source :src="data.url">
		</video>
		<div v-else-if="data.iframe" class="iframe-wrapper relative" :style="{paddingBottom: `${100/data.ratio}%`}" v-html="data.iframe"></div>
	</div>
</template>
<script>
import { defineComponent,computed } from "vue";
import blockParser from "/@/components/block-parser/parser.vue"
export default defineComponent({
	name: 'block-collapse',
	props: {
		data: {
			type: Object
		}
	},
})
</script>
<style lang="less" scoped>
.pandastudio-video.align-full {
	margin-left: -3em;
	margin-right: -3em;
}
@media (max-width: 577px) {
	.pandastudio-video.align-full {
		margin-left: -1em;
		margin-right: -1em;
	}
}
.pandastudio-video.is-video.align-left {
	text-align: left;
}
.pandastudio-video.is-video.align-center {
	text-align: center;
}
.pandastudio-video.is-video.align-right {
	text-align: right;
}
.pandastudio-video video {
	max-width: 100%;
}
.pandastudio-video.is-video.align-full video {
	width: 100%;
}
.iframe-wrapper {
	height: 0;
}
</style>
<style>
.pandastudio-video .iframe-wrapper > iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border: none;
}
@media (max-width: 577px) {
	.nv-columns.column-on-mobile > .nv-col > div > .pandastudio-video:only-child:not(.align-full) video {
		margin-left: auto;
		margin-right: auto;
	}
}
</style>