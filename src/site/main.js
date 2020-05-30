// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import './css/index.css';

import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'nl',
  fallbackLocale: 'nl',
});

import '@fortawesome/fontawesome-free/css/all.min.css';

import moment from 'moment';
moment.locale('nl');

/**
 * Initialize vuex
 */
import store from '@/site/store';

/**
 * Initialise casl
 */
import { abilitiesPlugin } from '@casl/vue';
import { ability } from '@/js/ability';
Vue.use(abilitiesPlugin, ability);

import VueWait from 'vue-wait';
Vue.use(VueWait);

import Notifications from 'vue-notification';
Vue.use(Notifications);

import routes from './routes';
const router = new VueRouter({
  routes
});
import VueScrollBehavior from 'vue-scroll-behavior';
Vue.use(VueScrollBehavior, { router: router });

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);
import MessageCard from '@/apps/site/MessageCard';
Vue.customElement('message-card', MessageCard);

new Vue({
  router,
  store,
  wait: new VueWait({
    useVuex: true,
  }),
  i18n,
}).$mount('#kwai');
