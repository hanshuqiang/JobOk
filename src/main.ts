import { createApp } from "vue";
import App from "./App.vue";

import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'

import "./assets/css/style.less"

 
 
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)


 
 

let app = createApp(App);
app.use(router);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(pinia);
app.mount("#app").$nextTick(() => {
  postMessage({ payload: "removeLoading" }, "*");
});
