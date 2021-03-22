const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack')

const pageSetup = {
    indexJS: './source/pages/landing/index.js',
    output: './build/pages/landing',
    indexHTML: './source/pages/landing/index.html',
    mode: process.env.NODE_ENV,
    get isDev() {
        return this.mode === 'development'
    },
    htmlVariables: {
        title: 'Blank Page'
    }
};

const filenameGenerator = (fallbackPrepend = '') => {
    return pageSetup.isDev ? { } : {
        filename: (pathData) => {
            const context = pathData?.module?.context;
            const prepend = context ?
                `../../${context.match(/assets\/.*/).pop()}/` : fallbackPrepend;
            return prepend + '[name][ext]';
        }
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
        compress: true,
        open: true,
        hot: true,
        port: 8080,
    },
    plugins: [
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
                test: /\.svg$/,
                type: 'asset',
                loader: 'svgo-loader',
                resourceQuery: { not: [/i/] },
                generator: filenameGenerator('../../assets/icons/'),
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                type: 'asset/resource',
                generator: filenameGenerator('../../assets/images/'),
            },
            {
                test: /\.woff2?$/,
                type: 'asset/resource',
                generator: filenameGenerator('../../assets/fonts/'),
            },
            {
                test: /\.(scss|css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'resolve-url-loader', 'sass-loader'],
            },
        ]
    },
}