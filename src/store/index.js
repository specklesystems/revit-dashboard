import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const TOKEN = 'SpeckleDemo.AuthToken'
const REFRESH_TOKEN = 'SpeckleDemo.RefreshToken'
const CHALLENGE = 'SpeckleDemo.Challenge'
const SERVER_URL = process.env.VUE_APP_SERVER_URL

const userInfoQuery = `query {
  user {
    name
    avatar
    streams(limit: 5) {
      totalCount
      items {
        id
        name
        commits(limit: 1) {
          totalCount
          items {
            id
            referencedObject
          }
        }
      }
    }
  },
  serverInfo {
    name
    company
  }
}`

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
      localStorage.removeItem(TOKEN)
      localStorage.removeItem(REFRESH_TOKEN)
    },
    async exchangeAccessCode(context, accessCode) {
      let response = await fetch(`${SERVER_URL}/auth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessCode: accessCode,
          appId: 'explorer',
          appSecret: 'explorer',
          challenge: localStorage.getItem(CHALLENGE)
        })
      })

      let data = await response.json()
      console.log("data", data.token)
      if (data.token) {
        localStorage.removeItem(CHALLENGE)
        context.commit("setToken", data.token)
        context.commit("setRefreshToken", data.refreshToken)
        localStorage.setItem(TOKEN, data.token)
        localStorage.setItem(REFRESH_TOKEN, data.refreshToken)
      }

    },
    getUser(context) {
      let token = localStorage.getItem(TOKEN)
      if (token) {
        fetch(`${SERVER_URL}/graphql`, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({query: userInfoQuery})
          }
        )
          .then(res => res.json())
          .then(json => {
            var data = json.data
            if (data.user) {
              console.log("Got user!", data.user)
              context.commit("setUser", data.user)
              console.log("User logged in as " + data.user.name)
            }
            if (data.serverInfo) {
              context.commit("setServerInfo", data.serverInfo)
            }
          })
      } else {
        console.log("User is not logged in")
      }
    },
    redirectToAuth() {
      // Generate random challenge
      var challenge = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      // Save challenge in localStorage
      localStorage.setItem(CHALLENGE, challenge)
      // Send user to auth page
      window.location = `${SERVER_URL}/authn/verify/${process.env.VUE_APP_SPECKLE_ID}/${challenge}`
    }
  },
  modules: {}
})
