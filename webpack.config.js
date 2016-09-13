var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
    entry: [
        './js/main.js',
        // './css/main.scss',
    ],
    output: {
        path: __dirname + "/build",
        filename: "main.js",
        publicPath: "/build"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.js$/, loader: 'babel' },
            { test: /\.html$/, loader: 'html' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('css') },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') }
        ],
    },
    plugins: [
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        })
    ],
    externals: {
        'text-encoding': 'window'
    }
};
