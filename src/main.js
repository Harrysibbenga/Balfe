import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "./assets/scss/custom.scss";
import "./assets/css/style.css";
import vuelidate from "vuelidate";
import wysiwyg from "vue-wysiwyg";
import Datepicker from "vuejs-datepicker";

const fb = require("./firebaseConfig");

// Components
import Button from "./components/UI/Button";
Vue.component("app-button", Button);
Vue.component("datepicker", Datepicker);

// MISC
Vue.use(vuelidate);
Vue.use(wysiwyg, {});

Vue.config.productionTip = false;
Vue.config.devtools = false;

// handle page reloads
let app;
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: "#app",
      router,
      store,
      render: h => h(App)
    });
  }
});