
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: './main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.js']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: path.resolve(__dirname, './src/js')
			},
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: path.resolve(__dirname, './src/js')
			},
			{
				test: /\.scss$/,
				use: [
				  // MiniCssExtractPlugin.loader,
				  'style-loader',
			    'css-loader', 
			    'sass-loader'
			  ]
				// include: path.resolve(__dirname, './src/scss')
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css"
      // chunkFilename: "[id].css"
    })
	],
	devServer: {
		hot: true,
		open: true
	},
	watch: true,
	watchOptions: {
		ignored: /node_modules/,
		aggregateTimeout: 300,
		poll: 1000
	}
}
