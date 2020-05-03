module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Beebulb";
      return args;
    });
  },

  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: true,
    },
  },
  transpileDependencies: ["quasar"],
  devServer: {
    proxy: "http://127.0.0.1:5000/",
  },
};
