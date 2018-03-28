const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helpers = require('./helpers');

const webpackConfigClient = {

    entry: helpers.root('src', 'client', 'index.js'),
    name: 'client',
    target: 'web',
    output: {
        path: helpers.root('build'),
        publicPath: '',
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.js'],
        modules: [helpers.root('src'), helpers.root('node_modules')]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html-loader?minimize=false'
            }
        ]
    },
    plugins: []

};

module.exports = webpackConfigClient;
