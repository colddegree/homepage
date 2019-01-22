const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

const HTML_WEBPACK_PLUGIN__MINIFY_OPTIONS = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
};

module.exports = {
    mode: "production",

    context: __dirname + "/src",

    entry: [
        "./js/entry.js",
        "./scss/entry.scss"
    ],
    output: {
        filename: "js/[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                include: path.resolve(__dirname, "src/html/templates"),
                use: ["raw-loader"]
            },
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, "src/scss"),
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: (loader) => [
                                require("cssnano")({
                                    preset: [
                                        "default",
                                        {
                                            discardComments: {
                                                removeAll: true
                                            }
                                        }
                                    ]
                                })
                            ]
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.(svg|png)$/,
                use: "file-loader"
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new MiniCssExtractPlugin({
           filename: "./css/style.bundle.css"
        }),

        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./html/index.html",
            minify: HTML_WEBPACK_PLUGIN__MINIFY_OPTIONS
        }),
        new HtmlWebpackPlugin({
            filename: "weather.html",
            template: "./html/weather.html",
            minify: HTML_WEBPACK_PLUGIN__MINIFY_OPTIONS
        }),
        new HtmlWebpackPlugin({
            filename: "crypto.html",
            template: "./html/crypto.html",
            minify: HTML_WEBPACK_PLUGIN__MINIFY_OPTIONS
        }),
        new HtmlWebpackPlugin({
            filename: "contact.html",
            template: "./html/contact.html",
            minify: HTML_WEBPACK_PLUGIN__MINIFY_OPTIONS
        }),

        new MomentLocalesPlugin({
            localesToKeep: ['ru']
        })
    ]
};
