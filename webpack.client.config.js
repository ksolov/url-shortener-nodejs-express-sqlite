const webpack = require('webpack');
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
            }
        ]
    },
    plugins: []

};

module.exports = webpackConfigClient;
