// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import './css/index.css';

import Vue from 'vue';

import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import { i18n } from '@/js/i18n';

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

/**
 * Initialise vue-wait
 */
import VueWait from 'vue-wait';
Vue.use(VueWait);

/**
 * Initialise vue-formulate
 */
import initFormulate from '@/js/formulate';
initFormulate();

/**
 * Initialise vue-notification
 */
import Notifications from 'vue-notification';
Vue.use(Notifications);

/**
 * Initialise vue-router
 */
import routes from './routes';
const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  // First check if navigation is allowed.
  const canNavigate = to.matched.every(route => {
    if (!route.meta.auth) return true;
    return ability.can(
      route.meta.auth.action || 'read',
      route.meta.auth.subject
    );
  });
  if (!canNavigate) {
    // Navigation not allowed, redirect to home page
    console.log(to.name, ' is not allowed!');
    return next({
      name: 'home',
      replace: true,
    });
  }

  to.meta.back = from;

  next();
});

import VueScrollBehavior from 'vue-scroll-behavior';
Vue.use(VueScrollBehavior, { router: router });

/**
 * Initialise vue-custom-element
 */
import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);
import MessageCard from '@/apps/portal/MessageCard';
Vue.customElement('message-card', MessageCard);

/**
 * Create Vue
 */
new Vue({
  router,
  store,
  wait: new VueWait({
    useVuex: true,
  }),
  i18n,
}).$mount('#kwai');
