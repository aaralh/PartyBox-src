import Vue from 'vue';
import Router from 'vue-router';
import Frontpage from '@/components/Frontpage.vue';
import Partybox from '@/components/Partybox.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
        path: "/",
        redirect: {
            name: "frontpage",
        },
    },
    {
        path: "/frontpage",
        name: "frontpage",
        component: Frontpage,
    },
    {
        path: "/partybox",
        name: "partybox",
        component: Partybox,
        beforeEnter: (to, from, next) => {
            next();
        },
    },
  ],
});
