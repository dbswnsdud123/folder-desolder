/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("raw")
      .test(/\.txt$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  },
  devServer: {
    https: false,
    host: "localhost",
  },
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      outputDir: "dist_electron",
      builderOptions: {
        productName: "Folder Desolder",
        artifactName: "Folder Desolder Setup ${version}.${ext}",
        win: {
          icon: "public/logo.png",
        },
        mac: {
          icon: "public/logo.png",
        },
      },
    },
  },
};
