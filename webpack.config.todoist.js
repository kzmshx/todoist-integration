const path = require("path")

const CopyPlugin = require("copy-webpack-plugin")
const GasPlugin = require("gas-webpack-plugin")

const config = {
    mode: "production",
    entry: {
        main: path.join(__dirname, "src/todoist/main.ts"),
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "dist/todoist"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts"],
    },
    plugins: [
        new GasPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, "src/todoist/public"),
                    to: path.join(__dirname, "dist/todoist/[name][ext]"),
                },
            ],
        }),
    ],
}

module.exports = config
