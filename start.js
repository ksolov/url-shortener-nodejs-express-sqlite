const webpack = require('webpack');

const webpackBackendConfig = require('./webpack.backend.config.js');
const webpackClientConfig = require('./webpack.client.config.js');

const backendCompiler = webpack(webpackBackendConfig);
const frontendCompiler = webpack(webpackClientConfig);
const STATS_OPTIONS = {
    assets: false,
    colors: true,
    version: false,
    modules: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    reasons: true,
    cached: true,
    chunkOrigins: true
};
frontendCompiler.plugin('compile', () => console.log('Building frontend...'));
backendCompiler.plugin('compile', () => console.log('Building server...'));

frontendCompiler.run(function(error, stats) {
    if (error) {
        console.error(error.stack || error);
        if (error.details) {
            console.error(error.details);
        }
        process.exit(1);
    }

    process.stdout.write(stats.toString(STATS_OPTIONS) + '\n');

    backendCompiler.run(function(error, stats) {
        if (error) {
            console.error(error.stack || error);
            if (error.details) {
                console.error(error.details);
            }
            process.exit(1);
        }

        process.stdout.write(`${stats.toString(STATS_OPTIONS)}\n`);
    });
});
