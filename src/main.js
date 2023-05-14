// import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import VueRouter from "vue-router";
import GullKit from "./plugins/gull.kit";
// import "babel-polyfill";
// import es6Promise from "es6-promise";
// es6Promise.polyfill();
import store from "./store";
import Breadcumb from "./components/breadcumb"
import axios from 'axios'

// un comment these  if you use firebase
// import firebase from "firebase/app";
// import "firebase/auth";
// import {firebaseSettings} from "@/data/config";
import i18n from "./lang/lang"
import VueAxios from 'vue-axios'
import money from 'v-money'
import VueLuxon from "vue-luxon"

Vue.component("breadcumb", Breadcumb);
// Vue.use(VueRouter);

Vue.use(VueAxios, axios)
Vue.use(money, {precision: 0, thousands: '.'})
Vue.use(VueLuxon, {
    input: {
        // zone: "utc",
        format: "iso"
    },
    output: "dd-MM-yyyy HH:mm"
})
Vue.use(GullKit)

const baseUrl = 'http://127.0.0.1:8005'
axios.defaults.baseURL = baseUrl + '/api/'
// firebase.initializeApp(firebaseSettings);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
