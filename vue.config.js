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
        target: "http://192.168.0.231:8080", // 메인
        //target: "http://192.168.0.84:8080", // 박설 연구원
        //target: "http://192.168.0.18:8080", // 노현종 선임
        //target: "http://192.168.0.126:9090", // 정호윤 연구원
        //target: "http://192.168.0.193:8081", // 대일책임님
        changeOrigin: true,
      },
    },
  },
  outputDir:
    "C:/Users/TWIM/Desktop/Server/SmartFarm_BE/SmartFarm_BE/tsmartfarm/src/main/resources/static",
  runtimeCompiler: true,
});

//target: "http://192.168.0.84:8080", // 설님 서버
//target: "http://14.47.96.237:8081", // 테육 서버
//설님 서버 id:master
//설님 서버 password:qwer1234!@
//브랜치 테스트
