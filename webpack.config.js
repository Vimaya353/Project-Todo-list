
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",

    entry: "./src/index.js",

    output: {
        filename: "main.js",
        clean: true,
        publicPath: "/Project-Todo-list/",
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },

    devServer: {
        static: "./dist",
        port: 8080,
    },
};
