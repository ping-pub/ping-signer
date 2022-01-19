const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const { execSync } = require('child_process')

process.env.VUE_APP_VERSION = require("./package.json").version;
// process.env.VUE_APP_GIT_BRANCH = process.env.CI_BRANCH || execSync('git rev-parse --abbrev-ref HEAD').toString('utf8').trim()

module.exports = {
  outputDir: "dist",
  runtimeCompiler: true,

  configureWebpack: {
    // resolve: {
    //   alias: require('./aliases.config').webpack
    // },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, "src/extension"),
          to: path.join(__dirname, "dist"),
          toType: "dir",
          ignore: ["index.html", ".DS_Store"],
        },
      ]),
    ],
  },

  css: {
    // Enable CSS source maps.
    sourceMap: false,
  },

  lintOnSave: true,
};
