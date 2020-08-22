var path = require("path");

// variables
var isProduction = process.argv.indexOf("-p") >= 0 || process.env.NODE_ENV === "production";
var sourcePath = path.join(__dirname, "./src");
var outPath = path.join(__dirname, "./dist");

// plugins
var HtmlWebpackPlugin = require("html-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var { CleanWebpackPlugin } = require("clean-webpack-plugin");
var HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
var DotenvWebpackPlugin = require("dotenv-webpack");

module.exports = (env) => {
    console.log("environment:", env);

    return {
        context: sourcePath,
        devtool: "inline-source-map",
        entry: {
            app: "./main.tsx",
        },
        mode: "production",
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
                    use: [
                        isProduction && {
                            loader: "babel-loader",
                            options: { plugins: ["react-hot-loader/babel"] },
                        },
                        "ts-loader",
                    ].filter(Boolean),
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
                { test: /\.html$/, use: "html-loader" },
                { test: /\.(png|svg)$/, use: "url-loader?limit=10000" },
                { test: /\.(jpg|gif)$/, use: "file-loader" },
            ],
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all",
                    },
                },

            },
        },
        plugins: [
            new DotenvWebpackPlugin({
                path: "./.env.defaults",
                defaults: !isProduction,
                systemvars: isProduction
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
            new HardSourceWebpackPlugin(),
        ],
        devServer: {
            contentBase: sourcePath,
            hot: true,
            inline: true,
            historyApiFallback: {
                disableDotRule: true,
            },
            stats: "minimal",
        },
    };
};
