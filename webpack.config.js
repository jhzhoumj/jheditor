const path = require( 'path' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );
var webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');//自动创建html文件
// const CleanWebpackPlugin = require('clean-webpack-plugin');//清除多余文件
module.exports = {
    // https://webpack.js.org/configuration/entry-context/
    entry: './app.js',

    // https://webpack.js.org/configuration/output/
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,

                use: [ 'raw-loader' ]
            },
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,

                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig( {
                            themeImporter: {
                                themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                            },
                            minify: true
                        } )
                    }
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
        ]
    },
    optimization: {
        // splitChunks: {
        //     // include all types of chunks
        //     chunks: 'all'
        // },
        minimize: true,
        minimizer: [new TerserPlugin({
            include: /\.js(\?.*)?$/i,
            cache: true,
          })]
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 8999,
        proxy: {
            '/api/*': {
            target: 'https://jztest.jinghangapps.com',
            changeOrigin: true,
            secure: false
            }
        },
    },
    plugins: [
        //每次编译都会把dist下的文件清除，我们可以在合适的时候打开这行代码，例如我们打包的时候，开发过程中这段代码关闭比较好
        // new CleanWebpackPlugin(['dist']),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            //使用一个模板
            template: './index.html' 
        })
    ]
    // plugins:[
    //     new uglifyjs(), //压缩js
    // ],
    // Useful for debugging.
    // devtool: 'source-map',

    // By default webpack logs warnings if the bundle is bigger than 200kb.
    // performance: { hints: false }
};