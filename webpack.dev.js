const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    target: 'web',
    // devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        writeToDisk: true,
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new CopyWebpackPlugin([{ from: 'src/images', to: 'images' }]),
        new HtmlWebpackPlugin({
            title: 'Dev',
            template: path.resolve(__dirname, 'src/public/index.html'),
            inject: true,
        }),
    ],
});