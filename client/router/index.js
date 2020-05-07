import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Detail from '../views/Detail.vue'
import Buy from '../views/Buy.vue'
import SelectSeat from '../views/SelectSeat.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/detail/:movieId',
    name: 'detail',
    component: Detail
  },
  {
    path: '/buy',
    name: 'buyPage',
    component: Buy
  },
  {
    path: '/select-seat',
    name: 'selectSeat',
    component: SelectSeat
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
