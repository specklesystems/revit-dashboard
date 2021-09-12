import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index.js'
import WelcomeView from "@/components/WelcomeView";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      isProtected: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: WelcomeView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( async (to, from, next) => {
  if(to.query.access_code){
    // If the route contains an access code, exchange it
    try {
      await store.dispatch('exchangeAccessCode', to.query.access_code)
    } catch (err){
      console.warn("exchange failed", err);
    }
    // Whatever happens, go home.
    next("/")
  }
  else if(to.meta.isProtected){
    await store.dispatch("getUser")
    var isAuth = store.getters.isAuthenticated
    if(!isAuth) next("/login")
    else next()
  }
  else {
    next()
  }
})

export default router
