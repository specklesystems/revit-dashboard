import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const TOKEN='SpeckleDemo.AuthToken'
const REFRESH_TOKEN = 'SpeckleDemo.RefreshToken'
const CHALLENGE = 'SpeckleDemo.Challenge'

export default new Vuex.Store({
  state: {
    user: null,
    serverInfo: null,
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
    }
  },
  actions: {
    logout(context) {
      context.commit("setUser", null)
      context.commit("setServerInfo", null)
      localStorage.removeItem( TOKEN )
      localStorage.removeItem( REFRESH_TOKEN )
    },
    async exchangeAccessCode(context, accessCode) {
      console.log('VUEX - Access code exchange', accessCode)
      let response = await fetch( 'http://localhost:3000/auth/token/', {
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
        console.log("setting local storage!")
        localStorage.removeItem( CHALLENGE )
        localStorage.setItem( TOKEN, data.token )
        localStorage.setItem( REFRESH_TOKEN, data.refreshToken )
      }

    },
    async getUser(context) {
      console.log("Getting user!")
      let token = localStorage.getItem(TOKEN)
      if (token) {
        let testResponse = await fetch('http://localhost:3000/graphql', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({query: '{ user { name }, serverInfo { name company } }'})
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
      window.location = `http://localhost:3000/authn/verify/${process.env.VUE_APP_SPECKLE_ID}/${challenge}`
    }
  },
  modules: {
  }
})
