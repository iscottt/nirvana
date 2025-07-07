<template>
	<component
	:is="`h${data.level}`"
	:style="{
		fontSize: `${data.fontSize}px`,
		color: data.color,
		fontWeight: `${data.fontWeight}`
	}"
	>{{data.text}}</component>
</template>
<script>
import { defineComponent,computed } from "vue";
export default defineComponent({
	name: 'block-header',
	props: {
		data: {
			type: Object
		}
	},
})
</script>