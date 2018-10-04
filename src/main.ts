import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import VueYoutube from 'vue-youtube';
import VueSocketio  from 'vue-socket.io';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
Vue.use(VueSocketio, 'http://partybox.dy.fi:5000');
Vue.use(VueYoutube);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
