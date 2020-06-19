import Vue from 'vue';
import URI from 'urijs';
import { http_auth} from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import Story from '@/models/Story';

/**
 * Initializes the state.
 * The key of the cache is the page offset. An offset which was already loaded
 * will be returned from this cache.
 */
const initialize = () => ({
  cache: {}, // Cached stories, offset is key
  count: 0, // Max. number of stories available in database
  error: null
});

const getters = {
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

const mutations = {
  /**
   * Put the stories in the cache.
   */
  setStories(state, { meta, data }) {
    state.error = null;
    Vue.set(state.cache, meta.offset, data);
    state.count = meta.count;
  },
  /**
   * Set the error
   */
  setError(state, error) {
    state.error = error;
  },
  /**
   * Reset to the initial state
   */
  reset(state) {
    Object.assign(state, initialize());
  }
};

const actions = {
  /**
   * Load news stories from the site application. When the stories for the
   * given offset were already loaded, the action returns immediately.
   */
  async load({ state, commit, dispatch }, { offset = 0 }) {
    if (state.cache[offset]) return;

    let uri = new URI('portal/stories');
    if (offset > 0) {
      uri.query({ 'page[offset]': offset });
    }

    dispatch('wait/start', 'portal.news.load', { root: true });
    try {
      const json = await http_auth
        .url(uri.href())
        .get()
        .json()
      ;
      const transformer = new Transformer();
      commit('setStories', {
        meta: json.meta,
        data: transformer.deserialize(Story, json)
      });
    } catch (error) {
      commit('setError', error);
    } finally {
      dispatch('wait/end', 'portal.news.load', { root: true });
    }
  },
  /**
   * Reset the state
   */
  reset({ commit }) {
    commit('reset');
  }
};

export default {
  namespaced: true,
  state: initialize(),
  getters,
  mutations,
  actions
};
