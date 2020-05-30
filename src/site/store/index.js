import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import { abilityPlugin } from '@/js/ability';

import kwai from './modules/kwai';
import applications from './modules/applications';
import authentication from './modules/authentication';
export default new Vuex.Store({
  namespaced: true,
  modules: {
    kwai,
    applications,
    authentication
  },
  plugins: [
    abilityPlugin,
  ]
});
