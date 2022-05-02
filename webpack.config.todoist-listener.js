const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");
const GasPlugin = require("gas-webpack-plugin");

const config = {
  target: "web",
  mode: "production",
  entry: {
    main: path.join(__dirname, "src/todoist-listener/main.ts")
  },
  output: {
    filename: "[name].gs",
    path: path.join(__dirname, "dist/todoist-listener"),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts"]
  },
  plugins: [
    new GasPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "src/todoist-listener/public"),
          to: path.join(__dirname, "dist/todoist-listener/[name][ext]")
        }
      ]
    })
  ]
};

module.exports = config;
