import * as path from "path"

import * as CopyPlugin from "copy-webpack-plugin"
import * as GasPlugin from "gas-webpack-plugin"
import { Configuration } from "webpack"

const config: Configuration = {
    mode: "production",
    entry: {
        main: path.join(__dirname, "main.ts"),
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "dist"),
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
        extensions: [".ts", ".js"],
    },
    plugins: [
        new GasPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, "appsscript.json"),
                },
            ],
        }),
    ],
}

export default config
