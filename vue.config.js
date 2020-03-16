module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: true
    }
  },
  transpileDependencies: ["quasar"],
  devServer: {
    proxy: "http://127.0.0.1:5000/"
  }
};
