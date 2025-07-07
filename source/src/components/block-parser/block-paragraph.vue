<template>
	<p
	class="block-paragraph"
	:style="{
		fontSize: `${data.fontSize}px`,
		color: data.color,
		textAlign: data.align == 'left' ? '' : data.align,
		fontWeight: `${data.fontWeight}`
	}"
	v-html="data.text"></p>
</template>
<script>
import { defineComponent,computed } from "vue";
export default defineComponent({
	name: 'block-paragraph',
	props: {
		data: {
			type: Object
		}
	},
})
</script>
