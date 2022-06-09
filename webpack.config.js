const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const Dotenv = require("dotenv-webpack")
const CompressionPlugin = require("compression-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
const webpack = require("webpack")
const TerserPlugin = require("terser-webpack-plugin")
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin

const ESLintPlugin = require("eslint-webpack-plugin")

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "static/js/main.[contenthash:6].js",
    clean: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      "@": path.resolve("src"),
      "@@": path.resolve()
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js|jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: ["babel-loader"]
      },
      {
        test: /\.(s[ac]ss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "static/fonts/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "static/media/[name].[ext]"
            }
          }
        ]
      }
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   type: "asset",
      // },
    ]
  },
  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    static: {
      directory: path.join(__dirname, "public")
    },
    compress: true,
    port: 3000,
    open: true
  },
  plugins: [],
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    minimize: true,
    minimizer: []
  },
  performance: {
    maxEntrypointSize: 800000 //  Khi có 1 file build vượt quá giới hạn này (tính bằng byte) thì sẽ bị warning trên terminal.
  }
}

const basePlugins = [
  new HtmlWebpackPlugin({
    template: "./public/index.html"
  }),
  new Dotenv(),
  new ESLintPlugin(),
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve("public"),
        filter: async resourcePath => {
          if (resourcePath.includes("index.html")) {
            return false
          }

          return true
        },
        to: "",
        context: path.resolve("public")
      }
    ]
  }),
  new MiniCssExtractPlugin({
    filename: "static/css/[name].[contenthash:6].css"
  }),
  new webpack.ProgressPlugin()
]

const productPlugins = [
  ...basePlugins,
  new CompressionPlugin({
    test: /\.(css|js|html|svg)$/
  })
]

const productMinimizer = [
  new TerserPlugin(),
  new ImageMinimizerPlugin({
    minimizer: {
      implementation: ImageMinimizerPlugin.imageminMinify,
      options: {
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }]
        ]
      }
    }
  }),
  new webpack.optimize.AggressiveMergingPlugin()
]

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map"
    config.plugins = basePlugins
  }

  if (argv.mode === "production") {
    config.plugins = productPlugins
    config.optimization.minimizer = productMinimizer
  }

  if (env.analyze) {
    config.plugins = [...config.plugins, new BundleAnalyzerPlugin()]
  }

  return config
}
