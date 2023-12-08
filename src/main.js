import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import GullKit from "./plugins/gull.kit";
import store from "./store";
import Breadcumb from "./components/breadcumb"
import axios from 'axios'
import i18n from "./lang/lang"
import VueAxios from 'vue-axios'
import money from 'v-money'
import VueLuxon from "vue-luxon"

Vue.component("breadcumb", Breadcumb);

Vue.use(VueAxios, axios)
Vue.use(money, {precision: 0, thousands: '.'})
Vue.use(VueLuxon, {
    input: {
        format: "iso"
    },
    output: "dd-MM-yyyy HH:mm"
})
Vue.use(GullKit)

// Simpan state Vuex saat me-refresh browser
window.addEventListener('beforeunload', () => {
  store.commit('auth/setToken', store.state.auth.token)
});

const baseUrl = 'http://127.0.0.1:8000'
// const baseUrl = 'https://api.haricar.com'
axios.defaults.baseURL = baseUrl + '/api/'
axios.interceptors.request.use(
  (config) => {
    const token = store.state.auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let isRefreshing = false
let refreshSubscribers = []

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
}

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token))
};

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            resolve(axios(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      return new Promise((resolve, reject) => {
        axios
          .get('/auth/refresh')
          .then((response) => {
            const token = response.data.data.token
            store.commit('setToken', token)
            localStorage.setItem('token', token)
            originalRequest.headers.Authorization = 'Bearer ' + token

            onRefreshed(token)
            resolve(axios(originalRequest))
          })
          .catch((error) => {
            store.dispatch('logout') // Logout jika refresh token gagal
            reject(error)
          })
          .finally(() => {
            isRefreshing = false
          });
      });
    }

    return Promise.reject(error)
  }
)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
