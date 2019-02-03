import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import VueYoutube from "vue-youtube";
import VueSocketio from "vue-socket.io";
import socketio from "socket.io-client";
import VueRouter from "vue-router";



Vue.use(VueRouter);
Vue.use(VueSocketio, socketio.connect("http://192.168.1.100:2000", {secure: true}));
Vue.use(VueYoutube);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
