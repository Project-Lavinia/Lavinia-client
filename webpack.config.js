var path = require("path");
var webpack = require("webpack");
var packageJson = require("./package.json");

// variables
var sourcePath = path.join(__dirname, "./src");
var outPath = path.join(__dirname, "./dist");
var appVersion = packageJson.version;
var dataVersion = packageJson.dataVersion;

if (!appVersion) {
    throw new TypeError("Missing package.json field: version");
}

if (!dataVersion) {
    throw new TypeError("Missing package.json field: dataVersion");
}

// plugins
var HtmlWebpackPlugin = require("html-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var { CleanWebpackPlugin } = require("clean-webpack-plugin");
var DotenvWebpackPlugin = require("dotenv-webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
    const isProduction = argv.mode === "production";

    return {
        context: sourcePath,
        devtool: isProduction ? "source-map" : "inline-source-map",
        entry: {
            app: "./main.tsx",
        },
        mode: argv.mode || "production",
        output: {
            path: outPath,
            filename: "js/[name].[hash].bundle.js",
            publicPath: "/",
        },
        target: "web",
        resolve: {
            extensions: [".js", ".ts", ".tsx"],
            // Fix webpack"s default behavior to not load packages with jsnext:main module
            // (jsnext:main directs not usually distributable es6 format, but es6 sources)
            mainFields: ["module", "browser", "main"],
            alias: {
                app: path.resolve(__dirname, "src/app/"),
            },
        },
        module: {
            rules: [
                // .ts, .tsx
                {
                    test: /\.tsx?$/,
                    use: ["ts-loader"],
                },
                // css
                {
                    test: /\.(scss|sass)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                // static assets
                { test: /\.(png|svg)$/, use: "url-loader?limit=10000" },
                { test: /\.(jpg|gif)$/, use: "file-loader" },
            ],
        },
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    reactVendor: {
                        test: /[\\/]node_modules[\\/](react|react-dom|react-redux|redux|redux-thunk)[\\/]/,
                        name: "react-vendors",
                        chunks: "all",
                        priority: 20,
                    },
                    uiVendor: {
                        test: /[\\/]node_modules[\\/](bulma|bulma-toast|react-table|lodash)[\\/]/,
                        name: "ui-vendors",
                        chunks: "all",
                        priority: 10,
                    },
                    common: {
                        minChunks: 2,
                        chunks: "all",
                        enforce: true,
                    },
                },
            },
        },
        plugins: [
            new DotenvWebpackPlugin({
                defaults: !isProduction,
                systemvars: isProduction,
            }),
            new webpack.DefinePlugin({
                "process.env.APP_VERSION": JSON.stringify(appVersion),
                "process.env.DATA_VERSION": JSON.stringify(dataVersion),
            }),
            new CleanWebpackPlugin({
                verbose: true,
            }),
            new MiniCssExtractPlugin({
                filename: "css/[name].[contenthash].css",
            }),
            new HtmlWebpackPlugin({
                template: "assets/index.html",
                favicon: "assets/favicon.ico",
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.join(sourcePath, "assets/election-data"),
                        to: path.join(outPath, "assets/election-data"),
                        noErrorOnMissing: false,
                    },
                ],
            }),
        ],
        devServer: {
            static: {
                directory: sourcePath,
            },
            hot: true,
            historyApiFallback: {
                disableDotRule: true,
            },
            client: {
                overlay: {
                    errors: !isProduction,
                    warnings: !isProduction,
                },
            },
        },
    };
};
