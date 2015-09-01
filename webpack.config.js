module.exports = {
    entry: "./js/main.js",
    output: {
        path: __dirname + "/build",
        filename: "main.js",
        publicPath: "/build"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' },
            { test: /node_modules\/admin-config\/.*\.jsx?$/, loader: 'babel' }
        ]
    }
};
