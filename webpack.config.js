const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (undefined, argv) => {
    return {
        mode: argv.dev ? 'development' : 'production',
        entry: {
            style : path.resolve(__dirname, 'src', 'scss', 'main.scss'),
            main: path.resolve(__dirname, 'src', 'js', 'app.js'),
            login: path.resolve(__dirname, 'src', 'js', 'login.js'),
            register: path.resolve(__dirname, 'src', 'js', 'register.js'),
            options: path.resolve(__dirname, 'src', 'js', 'options.js'),

            polyfills: path.resolve(__dirname, 'src', 'js', 'polyfills.js'),
        },
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: 'js/[name].bundle.js',
        },
        resolve: {
            alias: {
                vue: 'vue/dist/vue.common.js',
                velocity: 'velocity-animate/velocity.js'
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(argv.dev ? 'development' : 'production'),
            }),
            new webpack.ProvidePlugin({
                Vue: 'vue',
                Velocity: 'velocity'
            }),
            new MiniCssExtractPlugin({
                filename: 'css/main.css',
            }),
     
            new CompressionPlugin({
                // asset: "[path].gz[query]",
                algorithm: "gzip",
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.8
            }),

            // new BundleAnalyzerPlugin()
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vue: {
                        test: /[\\/]node_modules[\\/](.*vue.*)[\\/]/,
                        name: "vue",
                        chunks: 'all',
                        minSize: 0,
                        maxInitialRequests: Infinity,
                    },
                    echarts: {
                        test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
                        name: "echarts",
                        chunks: 'all',
                        minSize: 0,
                        maxInitialRequests: Infinity,
                    },
                    velocity: {
                        test: /[\\/]node_modules[\\/](velocity-animate)[\\/]/,
                        name: "velocity",
                        chunks: 'all',
                        minSize: 0,
                        maxInitialRequests: Infinity,
                    },
                },
            },
        
            minimizer: [
                new UglifyJsPlugin({
                    test: /\.js(\?.*)?$/i,
                    uglifyOptions: {
                        comments: false, // remove comments
                        compress: {
                        unused: true,
                        dead_code: true, // big one--strip code that will never execute
                        warnings: false, // good for prod apps so users can't peek behind curtain
                        drop_debugger: true,
                        conditionals: true,
                        evaluate: true,
                        drop_console: true, // strips console statements
                        sequences: true,
                        booleans: true,
                        }
                    }
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessorPluginOptions: {
                        preset: ['default', { discardComments: { removeAll: true } }],
                      },
                      canPrint: true
                })
            ],
          },

        devtool: 'cheap-source-map',
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
                },
                {
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}
            ],
        },
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            open: false,
        }
    }
}