var webpack = require('webpack');

module.exports = {
    entry: {
        'index': './assets/js/index.js'
    },
    output: {
        path:'./public/js/',
        filename: '[name].bundle.js',
        publicPath: '/termdemo/img/'
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                "presets": ["es2015", "react"],
                "plugins": [
                    ["antd", {
                        "style": "css",
                        "libraryDirectory": "lib",
                        "libraryName": "antd"
                    }]
                ]
            }
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(png|jpg|gif|jpeg)$/,
            loader: 'url-loader?limit=8192&name=../../img/[hash].[ext]'
        }]
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     minimize: true,
        //     compress: {
        //         warnings: false
        //     },
        //     output: {
        //         comments: false,
        //     },
        //
        // })
    ]
}
