const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const mode = {
    _value: process.env.NODE_ENV,
    _fix: process.env.FIX_ENV,
    get isFix() { return Boolean(this._fix) },
    get isProduction() { return this._value === 'production' },
    get isDevelopment() { return this._value === 'development' },
};

const name = {
    production: (fname, ext) => `${fname}.[contenthash].${ext}`,
    development: (fname, ext) => `${fname}.${ext}`,
    filename(fname, ext) {
        return mode.isDevelopment ? 
            this.development(fname, ext) : 
            this.production(fname, ext)
    },
};

const devServer = {
    contentBase: path.resolve(__dirname, './build'),
    historyApiFallback: true,
    hot: true,
    open: true,
};

module.exports = {
    mode: mode._value,
    /* NEEDED BY [DEV-SERVER + BROWSERSLIST] */
    target: name.isDevelopment ? 'web' : 'browserslist',
    entry: {
        main: path.resolve(__dirname, './source/index.js'),
    },
    output: {
        assetModuleFilename: 'assets/[name].[contenthash][ext]',
        path: path.resolve(__dirname, './build'),
        filename: name.filename('main', 'bundle.js'),
        clean: true,
    },
    devtool:
        mode.isDevelopment ? 'inline-source-map' : undefined,
    devServer:
        mode.isDevelopment ? devServer : undefined,
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './source/index.html'),
        }),
        new MiniCssExtractPlugin({ 
            filename: name.filename('styles', 'css')
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: path.resolve(__dirname, './public') }],
        }),
        new StylelintPlugin({
            fix: mode.isFix && mode.isProduction,
            context: path.resolve(__dirname, './source'),
            emitWarning: mode.isDevelopment,
            failOnError: mode.isProduction,
        }),
        new ESLintPlugin({ 
            fix: mode.isFix && mode.isProduction,
            extensions: ['ts', 'js'], 
            emitWarning: mode.isDevelopment,
            failOnError: mode.isProduction,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(j|t)s$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.s?css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: {sourceMap: mode.isDevelopment} },
                    { loader: 'resolve-url-loader' },
                    { loader: 'sass-loader', options: {sourceMap: true} },
                    { loader: 'postcss-loader' },
                ],
            },
            {
                test: [
                    /\.(?:ico|gif|png|jpg|jpeg)$/i,
                    /\.(woff(2)?|eot|ttf|otf)$/i, 
                ],
                type: 'asset/resource',
            },
            {
                test: /\.svg$/i,
                type: 'asset',
                use: 'svgo-loader',
            },
            {
                test: /\.(txt|json)$/i,
                type: 'asset/source',
            },
        ]
    },
};