const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack')

const pageSetup = {
    indexJS: './source/pages/landing/index.js',
    output: './build/pages/landing',
    indexHTML: './source/pages/landing/index.html',
    mode: 'production', 
    htmlVariables: {
        title: 'Blank Page'
    }
};

module.exports = {
    entry: {
        main: path.resolve(__dirname, pageSetup.indexJS),
    },
    output: {
        path: path.resolve(__dirname, pageSetup.output),
        filename: '[name].bundle.js',
    },
    optimization: { splitChunks: { chunks: 'all' } },
    mode: pageSetup.mode,
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './build'),
        watchContentBase: true,
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    plugins: [
        new CopyWebpackPlugin({ 
            patterns: [{ 
                from: './source/assets', 
                to: path.resolve(__dirname, './build/assets') 
            }] 
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, pageSetup.indexHTML),
            filename: 'index.html',
            vars: { ...pageSetup.htmlVariables },
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
          }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\/assets\//g,
                type: 'asset/inline',
                generator: { 
                    dataUrl: (_, {filename}) => '../..' + filename.match(/\/assets\/.*/g)
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader, 
                    {
                        loader: 'css-loader', 
                        options: { url: false } 
                    }, 
                    'sass-loader',
                ],
            },
        ]
    },
}