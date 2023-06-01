const AUTH_TOKEN_KEY = 'token'

const state = {
  token: localStorage.getItem(AUTH_TOKEN_KEY) || ''
}

const mutations = {
  setToken(state, token) {
    state.token = token
  },
}

const actions = {
  login({ commit }, credentials) {
    return new Promise((resolve, reject) => {
        this._vm.axios
        .post('/auth/login', credentials)
        .then((response) => {
            if (response.data.status == "SUCCESS") {
                const token = response.data.data.token
                commit('setToken', token)
                localStorage.setItem(AUTH_TOKEN_KEY, token) // Simpan token di localStorage
            }
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        });
    });
  },

  logout({ commit }) {
    commit('setToken', '')
    localStorage.removeItem(AUTH_TOKEN_KEY) // Hapus token dari localStorage
  },
}

export default {
  state,
  mutations,
  actions,
}
