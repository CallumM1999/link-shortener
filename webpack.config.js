const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (undefined, argv) => {
    return {
        mode: argv.dev ? 'development' : 'production',
        entry: path.resolve(__dirname, 'src', 'js', 'app.js'),
        output: {
            filename: 'js/bundle.js',
            path: path.resolve(__dirname, 'public')
        },
        resolve: {
            alias: {
                vue: 'vue/dist/vue.common.js'
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(argv.dev ? 'development' : 'production'),
            }),
            new webpack.ProvidePlugin({
                Vue: 'vue'
            }),
            new MiniCssExtractPlugin({
                filename: 'css/main.css',
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(s*)css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.html$/,
                    loader: "raw-loader"
                }
            ],
        },
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            open: true
        }
    }
}