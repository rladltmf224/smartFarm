import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#4CAF50", //기본색
        secondary: "#4CAF50",
        accent: "#00E676", //강조되는 색
        error: "#b71c1c",
        my_color: "#ffffff",
      },
    },
  },
});
