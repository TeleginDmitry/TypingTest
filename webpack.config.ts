import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import {
	Configuration as WebpackConfiguration,
	HotModuleReplacementPlugin,
} from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'

interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration
}

export default (env: { mode: 'development' | 'production' }) => {
	const mode = env.mode || 'development'

	const config: Configuration = {
		mode: mode,
		entry: './src/index.ts',
		output: {
			filename: '[name].[contenthash].js',
			path: path.resolve(__dirname, 'build'),
			assetModuleFilename: path.join('images', '[name].[contenthash][ext]'),
			clean: true,
		},
		module: {
			rules: [
				{
					test: /\.css$/i,
					include: [path.resolve(__dirname, 'src')],
					use: [
						mode !== 'production'
							? 'style-loader'
							: MiniCssExtractPlugin.loader,
						'css-loader',
						'postcss-loader',
					],
				},
				{
					test: /\.html$/,
					use: 'html-loader',
				},
				{
					test: /\.ts$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.(png|jpg|jpeg|gif)$/i,
					type: 'asset/resource',
				},

				{
					test: /\.svg$/,
					type: 'asset/resource',
					generator: {
						filename: path.join('icons', '[name].[contenthash][ext]'),
					},
				},
			],
		},
		resolve: {
			extensions: ['.ts', '.js'],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './src/index.html',
			}),
			new MiniCssExtractPlugin({
				filename: '[name].[contenthash].css',
			}),
			new HotModuleReplacementPlugin(),
		],
		devServer: {
			static: {
				directory: path.resolve(__dirname, 'build'),
			},
			port: 3000,
			open: true,
			hot: true,
			compress: true,
			historyApiFallback: true,
		},
	}

	return config
}
