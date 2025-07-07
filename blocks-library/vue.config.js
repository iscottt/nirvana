const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')


module.exports = defineConfig({
	publicPath: "./srcs/blocks/",
	outputDir: '../srcs/blocks/',
	transpileDependencies: true,
	runtimeCompiler: false,
	productionSourceMap: false,
	filenameHashing: false,
	chainWebpack: (config) => {
		config.optimization.delete('splitChunks');
		config
			.plugin('limitSplitChunks')
			.use(webpack.optimize.LimitChunkCountPlugin, [{ maxChunks: 1 }]);
		config.plugins.delete('html')
		config.plugins.delete('preload')
		config.plugins.delete('prefetch')
	},
	css: {
		extract: {
			filename: 'style.css',
		},
	},
	configureWebpack: {
		entry: "./src/index.js",
		experiments: {
			outputModule: true,
		},
		module: {
			rules: []
		},
		output: {
			filename: 'script.js',
			library: {
				type: 'module',
			}
		},
		externalsType: 'var',
		externals: {
			vue: 'nv.Vue'
		}
	},
})
