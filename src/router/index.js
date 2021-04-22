import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( (to, from, next) => {
  store.dispatch("getUser").then(() => {
    if(to.query.access_code){
      console.log("route contains access code...")
      return store.dispatch('exchangeAccessCode', to.query.access_code).then(() => "/").catch(err => console.warn("exchange failed", err))
    }
  }).then(to => next(to))
    .catch(err => {
    console.warn("get user failed",err)
    next("/")
  })
})

export default router
