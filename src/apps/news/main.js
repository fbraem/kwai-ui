import "babel-polyfill";

import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Vuex from 'vuex';
Vue.use(Vuex);
import store from '@/js/store';
import newsStore from './store';
store.registerModule('newsModule', newsStore);

import Vuetify from 'vuetify';
Vue.use(Vuetify);
import '@/../node_modules/vuetify/dist/vuetify.min.css';

import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

import VueKindergarten from 'vue-kindergarten';
Vue.use(VueKindergarten, {
    child : (store) => {
        return store ? store.getters.activeUser : null;
    }
});
import storyPerimeter from './perimeter.js';

import NewsApp from './app.vue';
import NewsCreate from './app/create.vue';
import NewsUpdate from './app/update.vue';
import NewsRead from './app/read.vue';

const router = new VueRouter({
    routes : [
        {
            path : '/',
            component : NewsApp
        },
        {
            path : '/read/:id',
            component : NewsRead
        },
        {
            path : '/create',
            component : NewsCreate
        },
        {
            path : '/update/:id',
            component : NewsUpdate
        }
    ]
});

var app = new Vue({
    router,
    store,
    perimeters : [
        storyPerimeter
    ]
}).$mount('#clubmanApp');