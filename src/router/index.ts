import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../page/Home/index.vue'
import Config from '../page/Config/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Ddoashbod',
    component: Home
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/config',
    name: 'Config',
    component: Config
  }
]

const router = createRouter({
  //Electron 只在 路由模式 为 hash 时，才可以正常运行
  history: createWebHashHistory(),
  routes
})

export default router