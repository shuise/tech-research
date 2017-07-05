/*
https://my.oschina.net/bosscheng/blog/514638
http://www.jianshu.com/p/f80c573cedaa
http://webpack.github.io/docs/configuration.html#entry
*/

var webpack = require('webpack');
module.exports = {
    entry: {
        im: './im.js',
        emoji: './emoji.js',
    },
    output: {
        path: __dirname,
        filename: '[name].realase.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },  
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader'
        }, {
            test: /\.jsx$/,
            loader: 'babel-loader!jsx-loader?harmony'
        }]
    },
    plugins: []
};