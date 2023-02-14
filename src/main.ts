import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueCookies from "vue-cookies";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import VueTheMask from "vue-the-mask";

Vue.use(VueTheMask);
Vue.use(VueCookies);
Vue.use(VueSweetalert2);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
