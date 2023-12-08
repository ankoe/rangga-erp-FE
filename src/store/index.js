import Vuex from "vuex";
import Vue from "vue";
import VuexPersistence from 'vuex-persist'
import largeSidebar from "./modules/largeSidebar";
import compactSidebar from "./modules/compactSidebar";
import config from "./modules/config";
import verticalSidebar from "./modules/verticalSidebar"
import exchange from "./modules/exchange"
import auth from "./modules/auth"

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    largeSidebar,
    compactSidebar,
    config,
    verticalSidebar,
    exchange,
    auth
  },
  plugins: [new VuexPersistence().plugin]
})
