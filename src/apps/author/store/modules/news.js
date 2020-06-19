import Vue from 'vue';
import URI from 'urijs';
import { http_api } from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import Story from '@/models/Story';

export const initialize = () => ({
  cache: {},
  count: 0,
  error: null
});

export const mutations = {
  setStories(state, { meta, data }) {
    state.error = null;
    Vue.set(state.cache, meta.offset, data);
    state.count = meta.count;
  }
};

export default {
  namespaced: true,
  state: initialize()
};
