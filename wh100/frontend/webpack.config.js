const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js", // Entry point of your React app
  output: {
    path: path.resolve(__dirname, "./static/frontend"), // Output directory
    filename: "[name].js", // Use chunk names for filenames
    publicPath: "/static/frontend/", // Public path for webpack to serve assets
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Handle both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/, // Add CSS loader if needed for Tailwind CSS
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Automatically resolve .js and .jsx files
  },
  optimization: {
    minimize: true, // Enable code minimization for production
    // splitChunks: {
    //   chunks: "all", // Splits vendor code into separate chunks for better caching
    // },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"), // Ensures React runs in production mode
    }),
  ],
  devtool: "source-map", // Generate source maps for easier debugging
//   devServer: {
//     static: path.resolve(__dirname, "./static/frontend"),
//     compress: true,
//     port: 3000,
//     historyApiFallback: true, // Support for React Router (SPA)
//     hot: true, // Enable hot reloading
//   },
};
