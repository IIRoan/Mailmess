const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = function override(config, env) {
  // Use 'development' or 'production' depending on the environment
  const mode = env === "development" ? "development" : "production";

  // Entry points
  config.entry = {
    main: "./src/index.tsx",
    contentScript: "./src/contentScript.tsx",
    backgroundScript: "./src/backgroundScript.tsx",
  };

  // Output
  config.output = {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  };

  // Resolve extensions
  config.resolve.extensions = [".tsx", ".ts", ".js"];

  // Module rules
  config.module.rules = [
    {
      test: /\.tsx?$/,
      loader: "ts-loader",
      exclude: /node_modules/,
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    },
  ];

  // Plugins
  config.plugins = (config.plugins || []).concat([
    new CopyWebpackPlugin({
      patterns: [
        { from: "public", to: "static" },
        { from: "./public/manifest.json", to: "." },
      ],
    }),
  ]);

  // Set mode
  config.mode = mode;

  return config;
};
