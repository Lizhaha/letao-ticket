import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import './assets/theme/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI);

let vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default vue;