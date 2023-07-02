const AUTH_TOKEN_KEY = 'token'

const state = {
  token: localStorage.getItem(AUTH_TOKEN_KEY) || '',
  id: null,
  company_id: null,
  name: null,
  email: null,
  mobile: null,
  image_profile: null,
  role_group: null,
  role_display_name: null
}

const getters = {
  getProfile(state) {
      return {
        id: state.id,
        company_id: state.company_id,
        name: state.name,
        email: state.email,
        mobile: state.mobile,
        image_profile: state.image_profile,
        role_group: state.role_group,
        role_display_name: state.role_display_name,
      }
  }
}

const mutations = {
  setToken(state, token) {
    state.token = token
  },
  setProfile(state, data) {
    state.id = data.id
    state.company_id = data.company_id
    state.name = data.name
    state.email = data.email
    state.mobile = data.mobile
    state.image_profile = data.image_profile
    state.role_group = data.roles[0].group
    state.role_display_name = data.roles[0].display_name
  }
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
                commit('setProfile', response.data.data)
                localStorage.setItem(AUTH_TOKEN_KEY, token)
                localStorage.setItem("permissions", JSON.stringify(response.data.data.permissions))
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
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem("permissions")
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
