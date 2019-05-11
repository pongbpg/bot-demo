const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// var fs = require('fs');
// var nodeModules = {};
// fs.readdirSync('node_modules')
//     .filter(function (x) {
//         return ['.bin'].indexOf(x) === -1;
//     })
//     .forEach(function (mod) {
//         nodeModules[mod] = 'commonjs ' + mod;
//     });
// const nodeExternals = require('webpack-node-externals');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: '.env.development' });
}
// process.env.NODE_ENV

module.exports = (env) => {
    const isProduction = env === 'production';
    const CSSExtract = new ExtractTextPlugin('styles.css');
    return {
        // externals: {
        //     '@google-cloud/storage': 'commonjs @google-cloud/storage'
        // },
        // target: 'web',
        // externals: nodeModules,
        entry: ['babel-polyfill', './src/app.js'],
        output: {
            path: path.join(__dirname, 'public', 'dist'),
            filename: 'bundle.js'
        },
        // node: {
        //     fs: 'empty',
        //     child_process: 'empty',
        //     net: 'empty',
        //     tls: 'empty',
        // },
        module: {
            rules: [
                {
                    loader: 'json-loader',
                    test: /\.json$/
                },
                {
                    loader: 'babel-loader',
                    test: /\.js$/,
                    exclude: /node_modules/
                },
                {
                    test: /\.s?css$/,
                    use: CSSExtract.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    })
                }
            ]
        },
        plugins: [
            CSSExtract,
            new webpack.DefinePlugin({
                'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
                'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
                'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
                'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
                'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
                'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
                'process.env.ADMIN_PRIVATE_KEY_ID': JSON.stringify(process.env.ADMIN_PRIVATE_KEY_ID),
                'process.env.ADMIN_PRIVATE_KEY': JSON.stringify(process.env.ADMIN_PRIVATE_KEY),
                'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
                'process.env.CLIENT_EMAIL': JSON.stringify(process.env.CLIENT_EMAIL)
            })
        ],
        devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            historyApiFallback: true,
            publicPath: '/dist/',
            proxy: {
                '/api': 'http://127.0.0.1:3000'
            },
            port: 8080
        }
    }
};