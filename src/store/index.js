import Vue from 'vue'
import Vuex from 'vuex'
import {exchangeAccessCode, getStreamCommits, getUserData, goToSpeckleAuthPage, speckleLogOut} from "@/speckleUtils";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    serverInfo: null,
    currentStream: null,
    latestCommits: null
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
    setCurrentStream(state, stream) {
      state.currentStream = stream
    },
    setCommits(state, commits){
      state.latestCommits = commits
    }
  },
  actions: {
    logout(context) {
      // Wipe the state
      context.commit("setUser", null)
      context.commit("setServerInfo", null)
      context.commit("setCurrentStream", null)
      context.commit("setCommits", null)
      // Wipe the tokens
      speckleLogOut()
    },
    exchangeAccessCode(context, accessCode) {
      return exchangeAccessCode(accessCode)
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
    },
    handleStreamSelection(context, stream) {
      context.commit("setCurrentStream", stream)
      return getStreamCommits(stream.id, 10, null)
        .then(json => {
          context.commit("setCommits", json.data.stream.commits)
        })
    }
  },
  modules: {}
})
