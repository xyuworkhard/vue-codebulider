import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/index/Home.vue'
import InitConfig from '@/views/index/InitConfig'
import Login from "@/views/index/Login"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/initconfig',
    name: 'initConfig',
    // component: InitConfig
    component: () => import(/* webpackChunkName: "parser-example" */'@/views/index/InitConfig.vue')
  },
  {
    path: '/form',
    name: 'home',
    component: Home
  },
  {
    path: '/parser',
    name: 'parser',
    component: () => import(/* webpackChunkName: "parser-example" */'@/components/parser/example/Index.vue')
  },
  {
    path: '/tinymce',
    name: 'tinymce',
    component: () => import(/* webpackChunkName: "tinymce-example" */'@/components/tinymce/example/Index.vue')
  },
  // {
  //   path: '*',
  //   redirect: {
  //     name: 'initConfig',
  //   }
  // }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
