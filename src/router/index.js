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
  else {
    try {
      // Check on every route change if you still have access.
      var goto = await store.dispatch("getUser")
      next(goto)
    } catch (err) {
      next("/")
    }
  }
})

export default router
