const CopyWebpackPlugin = require('copy-webpack-plugin');
const HubSpotAutoUploadPlugin = require('@hubspot/webpack-cms-plugins/HubSpotAutoUploadPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const webpack = require('webpack');

const hubspotConfig = ({ portal, autoupload } = {}) => {
    return merge(common, {
        mode: 'production',
        plugins: [
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            new HubSpotAutoUploadPlugin({
                portal,
                autoupload,
                src: 'dist',
                dest: 'avidly-react-app',
            }),
            new CopyWebpackPlugin([
                { from: 'src/images', to: 'images' },
                {
                    from: 'src/modules',
                    to: 'modules',
                },
            ]),
        ],
    });
};

module.exports = [hubspotConfig];