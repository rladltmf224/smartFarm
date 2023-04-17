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
        // target: "http://14.47.96.237:8081", // 메인
        // target: "http://192.168.0.227:8080", // 메인
        //target: "http://192.168.0.84:8080", // 박설 연구원
        target: "http://192.168.0.18:8089", // 노현종 선임
        //target: "http://192.168.0.126:9090", // 정호윤 연구원
        changeOrigin: true,
      },
    },
  },
  outputDir:
    "C:/Users/TWIM/Desktop/Server/SmartFarm_BE/SmartFarm_BE/tsmartfarm/src/main/resources/static",
  runtimeCompiler: true,
});
