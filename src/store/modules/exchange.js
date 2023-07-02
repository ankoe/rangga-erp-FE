const state = {
    rate: 15000,
    currency: 'idr'
}

const getters = {
    getRate(state) {
        return (state.currency == 'idr')? 1 : (1/state.rate)
    },
    getExchangeLocale(state) {
        return (state.currency == 'idr')? 'id-ID' : 'en-US'
    },
}

const actions = {
    changeCurrency({commit}, data){
        commit('CHANGE_CURRENCY', data)
    },
    async syncRate({commit}){
        let { data } = await this._vm.axios.get('https://api.exchangerate.host/convert?from=USD&to=IDR')
        commit('CHANGE_RATE', data.info.rate)
    },
}

const mutations = {
    CHANGE_CURRENCY(state, data){
        state.currency = data
    },
    CHANGE_RATE(state, data){
      state.rate = parseFloat(data)
  },
}
export default {
    state,
    getters,
    actions,
    mutations
}