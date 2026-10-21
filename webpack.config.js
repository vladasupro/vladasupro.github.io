'use strict';

const distFolderPath = './';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { HtmlIncludesPlugin } = require('./build/html-includes');
// const webpack = require('webpack')
// const HtmlWebpackSimpleIncludePlugin = require('html-webpack-simple-include');
// const fs = require('fs');

module.exports = {

    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

    entry: {
        app: './assets/src/js/app.js',
    },

    output: {
        path: path.resolve(__dirname, 'assets/dist'),
        filename: '[name].min.js',
        assetModuleFilename: 'fonts/[name][ext][query]'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: {
                                filter: (url, resourcePath) => {
                                    // Don't process data URLs
                                    if (url.startsWith('data:')) {
                                        return false;
                                    }
                                    return true;
                                }
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext][query]'
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 0 // Always emit as separate file, never inline
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|png|jpeg|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[name][ext]'
                }
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].min.css'
        }),
        // Builds the pages in the project root from assets/src/pages + assets/src/partials
        new HtmlIncludesPlugin({
            pagesDir: path.resolve(__dirname, 'assets/src/pages'),
            partialsDir: path.resolve(__dirname, 'assets/src/partials'),
            outputDir: __dirname,
        }),
    ],

    stats: {
        colors: true,
        children: false,
    },

    externals: {
        jquery: 'jQuery'
    },

    devtool: 'cheap-source-map'

};
