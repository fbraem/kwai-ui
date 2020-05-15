import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import { abilityPlugin } from '@/js/ability';
const store = new Vuex.Store({
  namespaced: true,
  plugins: [ abilityPlugin ],
});

import kwaiModule from '@/site/store';
store.registerModule('kwai', kwaiModule);

import authModule from '@/apps/auth/store';
store.registerModule('auth', authModule);

import categoryModule from '@/apps/categories/store';
store.registerModule('category', categoryModule);

export default store;
