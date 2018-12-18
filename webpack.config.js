const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const eventBus = require('eventbusjs');

const SRC = path.resolve(__dirname, 'src/images');
const isDevEnv = process.env.NODE_ENV === 'development';
module.exports = {
    mode: process.env.NODE_ENV,
    entry: "./src/js/scripts/Controller.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        chunkFilename: '[name].bundle.js',
        filename: "index.bundle.js"
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpe?g|png|gif|mp3)$/i,
                include: SRC,
                loaders: ['file-loader']
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                include: SRC,
                loader: 'file-loader'
            }
        ]
    },
    "devtool": isDevEnv ? "source-map" : "",
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HTMLWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new CopyWebpackPlugin([{
                from: 'src/config',
                to: 'config'
            },
            {
                from: 'src/courses',
                to: 'courses'
            }
        ], {
            debug: true
        })
    ]
};