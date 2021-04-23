import Vue from 'vue'
import Vuex from 'vuex'
import {exchangeAccessCode, getUserData, goToSpeckleAuthPage, speckleLogOut} from "@/speckleUtils";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    serverInfo: null,
    token: null,
    refreshToken: null
  },
  getters: {
    isAuthenticated: (state) => state.user != null
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setServerInfo(state, info) {
      state.serverInfo = info
    },
    setToken(state, token) {
      state.token = token
    },
    setRefreshToken(state, token) {
      state.refreshToken = token
    }
  },
  actions: {
    logout(context) {
      context.commit("setUser", null)
      context.commit("setServerInfo", null)
      context.commit("setToken", null)
      context.commit("setRefreshToken", null)
      speckleLogOut()
    },
    exchangeAccessCode(context, accessCode) {
      return exchangeAccessCode(accessCode).then(data => {
        if (data.token) {
          context.commit("setToken", data.token)
          context.commit("setRefreshToken", data.refreshToken)
        }
      })
    },
    getUser(context) {
      return getUserData()
        .then(json => {
          var data = json.data
          context.commit("setUser", data.user)
          context.commit("setServerInfo", data.serverInfo)
        })
        .catch(err => {
          console.error(err)
        })
    },
    redirectToAuth() {
      goToSpeckleAuthPage()
    }
  },
  modules: {}
})
