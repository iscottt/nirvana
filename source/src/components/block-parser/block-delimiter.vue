<template>
	<div :style="{height: `${$props.data.customHeight}px`}" :class="{'hide-symbol': $props.data.hideSymbol}"></div>
</template>
<script setup>
const $props = defineProps({
	data: {
		type: Object,
	}
})
</script>
<style lang="less" scoped>
div {
	&:before {
		display: inline-block;
		content: "***";
		font-size: 2em;
		line-height: 3em;
		height: 2.6em;
		letter-spacing: .2em;
		color: var(--border-color);
		text-shadow: 0 2px var(--white-default);
	}
	text-align: center;
	font-size: 14px;
	display: flex;
	justify-content: center;
	align-items: center;

	&.hide-symbol:before {
		content: none;
	}
}
</style>