const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        content: './src/content.js',
        background: './src/background.js',
    },
    // mode: "development",
    // devtool: "source-map",
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './src/icons', to: './icons/' },
                { from: './manifest.json', to: './manifest.json' },
                { from: './background.js', to: './background.js' },
                { from: './content.js', to: './content.js' },
            ],
        }),
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