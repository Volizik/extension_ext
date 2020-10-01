const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const CreateFilePlugin = require('./webpack-create-file-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
    entry: {
        content: './src/content.js',
        background: './src/background.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode,
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './src/icons', to: './icons/' },
                { from: './manifest.json', to: './manifest.json' },
            ],
        }),
        new CreateFilePlugin(['content', 'background']),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
};
