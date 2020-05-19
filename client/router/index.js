import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Detail from '../views/Detail.vue'
import Buy from '../views/Buy.vue'
import SelectSeat from '../views/SelectSeat.vue'
import Order from '../views/Order.vue'
import Personal from '../views/Personal.vue'
import Manage from '../views/Manage.vue'
import WantLook from '../views/WantLook.vue'
import Etc from '../views/Etc.vue'

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
    path: '/order',
    name: 'order',
    component: Order
  },
  {
    path: '/personal',
    name: 'personal',
    component: Personal
  },
  {
    path: '/manage',
    name: 'manage',
    component: Manage
  },
  {
    path: '/wantLook',
    name: 'wantLook',
    component: WantLook
  },
  {
    path: '/etc',
    name: 'etc',
    component: Etc
  },
  {
    path: '*',
    name: 'index',
    component: Index
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
