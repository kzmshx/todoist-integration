import * as path from "path"

import * as GasPlugin from "gas-webpack-plugin"
import { Configuration } from "webpack"

const config: Configuration = {
    target: "web",
    mode: "production",
    entry: {
        main: path.join(__dirname, "src/todoist-listener/main.ts"),
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "dist/todoist-listener"),
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
    plugins: [new GasPlugin()],
}

export default config
