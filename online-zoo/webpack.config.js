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
    // development production
    // isDevelopment: process.env.NODE_ENV === 'development',
};


module.exports = {
    entry: {
        main: path.resolve(__dirname, pageSetup.indexJS),
    },
    output: {
        path: path.resolve(__dirname, pageSetup.output),
        filename: '[name].bundle.js',
    },
    mode: pageSetup.mode,
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './build'),
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
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
          }),
        // new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            {        
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,        
                type: 'asset/inline',      
            },
            {
                test: /\.(scss|css)$/, // 'style-loader'
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'resolve-url-loader', 'sass-loader'],
            },
        ]
    },
}