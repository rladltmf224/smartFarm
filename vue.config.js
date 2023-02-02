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
        //target: "http://14.47.96.237:8081", // 노서버2
        target: "http://192.168.0.38:8080", // 노서버2
        changeOrigin: true,
      },
    },
  },
});
