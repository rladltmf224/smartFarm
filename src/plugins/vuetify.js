import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#01B58B", //기본색
        secondary: "#4CAF50",
        accent: "#1976d2", //강조되는 색
        error: "#ff5252",
        blue: "#477EFF",
        //#477EFF
      },
    },
  },
});
