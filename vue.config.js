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


        target: "http://14.47.96.237:8081", // 노서버2

        changeOrigin: true,
      },
    },
  },
});

//target: "http://192.168.0.84:8080", // 설님 서버
//target: "http://192.168.0.231:8080", // 테육 서버
