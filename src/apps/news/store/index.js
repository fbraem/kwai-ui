import Vue from 'vue';
import moment from 'moment';
import URI from 'urijs';
import { http_api } from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import Story from '@/models/Story';

/**
 * Initializes the state of the store.
 * The key of the cache is the page offset. An offset which was already loaded
 * will be returned from this cache. The current story is the story that is
 * currently shown.
 */
const initialize = () => {
  return {
    cache: {},
    count: 0,
    current: null,
    error: null,
    archive: {}
  };
};

const getters = {
  /**
   * Get story from the list
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
   * Reset state
   */
  reset(state) {
    Object.assign(state, initialize());
  },
  /**
   * Put the stories in the cache
   */
  setStories(state, {meta, data}) {
    state.error = null;
    Vue.set(state.cache, meta.offset, data);
    state.count = meta.count;
  },
  /**
   * Set the current story
   */
  setCurrent(state, current) {
    state.error = null;
    state.current = current;
  },
  /**
   * Fill the archive with month, year and number of stories in that month.
   */
  setArchive(state, data) {
    state.error = null;
    state.archive = {};
    data.forEach((element) => {
      if (!state.archive[element.year]) {
        state.archive[element.year] = [];
      }
      state.archive[element.year].push({
        monthName: moment.months()[element.month - 1],
        month: element.month,
        year: element.year,
        count: element.count,
      });
    });
  },
  /**
   * Set the error
   */
  setError(state, error) {
    state.error = error;
  }
};

const actions = {
  /**
   * Load all news stories. When the news stories for the given offset were
   * already loaded, the action returns immediately, unless reset is set to
   * true.
   */
  async load({ dispatch, commit, state }, payload = {}, reset = false) {
    if (!reset && state.cache[payload.offset || 0]) return;

    let uri = new URI('news/stories');
    if (payload.offset && payload.offset > 0) {
      uri.query({ 'page[offset]': payload.offset });
    }
    if (payload.limit) {
      uri.query({ 'page[limit]': payload.limit });
    }
    if (payload.application) {
      uri.query({ 'filter[application]': payload.application });
    }
    if (payload.year) {
      uri.query({ 'filter[year]': payload.year });
    }
    if (payload.month) {
      uri.query({ 'filter[month]': payload.month });
    }
    if (payload.featured) {
      uri.query({ 'filter[featured]': true });
    }
    if (payload.user) {
      uri.query({'filter[user]': payload.user });
    }

    dispatch('wait/start', 'news.load', {root: true});
    try {
      const json = await http_api
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
      dispatch('wait/end', 'news.load', {root: true});
    }
  },
  /**
   * Read a news story.
   */
  async read({getters, dispatch, commit, state}, { id }) {
    // Don't read it again when it is already current...
    if (state.current?.id === id) {
      return;
    }
    // When it is available in the cache, set it as current...
    const story = getters['story'](id);
    if (story) { // already read
      commit('setCurrent', story);
      return;
    }

    let uri = new URI('news/stories');
    uri.segment(id);

    dispatch('wait/start', 'news.read', { root: true });
    try {
      const json = await http_api
        .url(uri.href())
        .get()
        .json()
      ;
      const transformer = new Transformer();
      commit('setCurrent', transformer.deserialize(Story, json));
    } catch (error) {
      commit('setError', error);
    } finally {
      dispatch('wait/end', 'news.read', { root: true });
    }
  },
  /**
   * Load archive
   */
  async loadArchive({ dispatch, commit }) {
    dispatch('wait/start', 'news.archive', { root: true });
    try {
      const json = await http_api
        .url('news/archive')
        .get()
        .json()
      ;
      commit('setArchive', json);
    } catch (error) {
      commit('setError', error);
    } finally {
      dispatch('wait/end', 'news.archive', { root: true });
    }
  },
  /**
   * When a story was read in another instance of this module, setCurrent can be
   * used to make it available in the current instance.
   */
  setCurrent({ commit }, story) {
    commit('setCurrent', story);
  },
  /**
   * Reset the state
   */
  reset({commit}) {
    commit('reset');
  }
};

export default {
  namespaced: true,
  state: initialize(),
  getters,
  mutations,
  actions,
  modules: {},
};
