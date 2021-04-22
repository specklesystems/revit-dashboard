import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const TOKEN='SpeckleDemo.AuthToken'
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
    setUser(state, user){
      state.user = user
    },
    setServerInfo(state, info){
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
      localStorage.removeItem( TOKEN )
      localStorage.removeItem( REFRESH_TOKEN )
    },
    async exchangeAccessCode(context, accessCode) {
      console.log('VUEX - Access code exchange', accessCode)
      let response = await fetch( `${SERVER_URL}/auth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
          accessCode: accessCode,
          appId: 'explorer',
          appSecret: 'explorer',
          challenge: localStorage.getItem( CHALLENGE )
        } )
      } )

      let data = await response.json( )
      console.log("data", data.token)
      if ( data.token ) {
        localStorage.removeItem( CHALLENGE )
        context.commit("setToken", data.token)
        context.commit("setRefreshToken", data.refreshToken)
        localStorage.setItem( TOKEN, data.token )
        localStorage.setItem( REFRESH_TOKEN, data.refreshToken )
      }

    },
    async getUser(context) {
      console.log("Getting user!")
      let token = localStorage.getItem(TOKEN)
      if (token) {
        let testResponse = await fetch(`${SERVER_URL}/graphql`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({query: userInfoQuery})
        })

        let data = (await testResponse.json()).data
        // if res.data.user is non null, means the ping was ok & token is valid
        if (data.user) {
          console.log("Got user!", data.user)
          context.commit("setUser", data.user)
        }
        if (data.serverInfo){
          context.commit("setServerInfo", data.serverInfo)
        }
      }
    },
    redirectToAuth( ) {
      var challenge = Math.random( ).toString( 36 ).substring( 2, 15 ) + Math.random( ).toString( 36 ).substring( 2, 15 )
      localStorage.setItem(CHALLENGE, challenge)
      window.location = `${SERVER_URL}/authn/verify/${process.env.VUE_APP_SPECKLE_ID}/${challenge}`
    }
  },
  modules: {
  }
})
