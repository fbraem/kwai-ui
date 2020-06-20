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

export const getters = {
  /**
   * Search a story in the cache
   */
  story: (state) => (id) => {
    for (const [, stories] of Object.entries(state.cache)) {
      const story = stories.find(s => s.id === id);
      if (story) return story;
    }
    return null;
  }
};

export const mutations = {
  setStories(state, { meta, data }) {
    state.error = null;
    Vue.set(state.cache, meta.offset, data);
    state.count = meta.count;
  }
};

export const actions = {

};

export default {
  namespaced: true,
  state: initialize(),
  getters,
  mutations,
  actions
};
