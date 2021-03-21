const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
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

const filenameGenerator = (fallbackPrepend = '') => ({
    filename: (pathData) => {
        const context = pathData?.module?.context;
        const prepend = context ?
            `../../${context.match(/assets\/.*/).pop()}/` : fallbackPrepend;
        return prepend + '[name][ext]';
    }
});

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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, pageSetup.indexHTML),
            filename: 'index.html',
            vars: { ...pageSetup.htmlVariables },
        }),
        new HtmlWebpackInlineSVGPlugin(),
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
                generator: filenameGenerator('../../assets/icons/'),
            },
            {
                resourceQuery: /inline/,
                type: 'asset/resource',
                generator: filenameGenerator(''),
                loader: 'svgo-loader',
                options: { plugins: [
                    { name: 'removeXMLNS' },
                ]},
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