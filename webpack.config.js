/** webpack.config.js */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
      app:  './src/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime'],
                          },
                    },
                    
                ]
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            {
                from: '**/*.wxml',
                toType: 'dir',
            },
            {
                from: '**/*.wxss',
                toType: 'dir',
            },
            {
                from: '**/*.json',
                toType: 'dir',
            },
        ])
    ]
}