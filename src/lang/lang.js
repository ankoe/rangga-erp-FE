import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

const DEFAULT_LANG = "en";
const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency',
      currency: 'USD'
    }
  },
  'id-ID': {
    currency: {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }
  }
}


const locales = {
  bn: require("./i18n/bn.json"),
  en: require("./i18n/en.json"),
  de: require("./i18n/de.json")
};
const i18n = new VueI18n({
  locale: DEFAULT_LANG,
  messages: locales,
  numberFormats
});

export default i18n;
