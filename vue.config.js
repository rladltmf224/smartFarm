const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  // productionSourceMap: false,
  // configureWebpack: {
  //   mode: "production",
  //   devtool: "eval",
  // },
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api/": {
        //target: "http://54.82.65.177:9091", // 노서버2
        target: "http://192.168.0.231:9090", // 노서버2
        //target: "http://54.82.65.177:9091", // 노서버2
        changeOrigin: true,
      },
    },
  },
});
