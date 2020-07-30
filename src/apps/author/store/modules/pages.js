import Vue from 'vue';
import URI from 'urijs';
import { http_api } from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import Page from '@/models/Page';

export const initialize = () => ({
  cache: {},
  count: 0,
  error: null,
  current: null
});

export const getters = {
  /**
   * Search a page in the cache
   */
  page: (state) => (id) => {
    for (const [, pages] of Object.entries(state.cache)) {
      const page = pages.find(s => s.id === id);
      if (page) return page;
    }
    return null;
  },
};

export const mutations = {
  setPages(state, { meta, data }) {
    state.error = null;
    Vue.set(state.cache, meta.offset, data);
    state.count = meta.count;
  },
  /**
   * When the page is already loaded in the cache, update it
   */
  setPage(state, page) {
    for (const [, pages] of Object.entries(state.cache)) {
      const index = pages.findIndex(s => s.id === page.id);
      if (index !== -1) {
        Vue.set(pages, index, page);
        break;
      }
    }
  },
  setError(state, error) {
    state.error = error;
  },
  /**
   * Set the current page
   */
  setCurrent(state, current) {
    state.error = null;
    state.current = current;
  },
  reset(state) {
    Object.assign(state, initialize());
  }
};

export const actions = {
  reset({ commit }) {
    commit('reset');
  },
  async load(
    { state, commit, dispatch },
    { offset = 0, limit = 10, application, enabled, sort, reload = false }
  ) {
    if (!reload && state.cache[offset]) return;

    let uri = new URI('author/pages');
    if (offset > 0) {
      uri.addQuery({ 'page[offset]': offset });
    }
    uri.addQuery({ 'page[limit]': limit });
    if (application) {
      uri.addQuery({ 'filter[application]': application });
    }
    if (enabled) {
      uri.addQuery({ 'filter[enabled]': true });
    }
    if (sort === '1') {
      uri.addQuery({ sort: 'application' });
    } else if (sort === '2') {
      uri.addQuery({ sort: 'date' });
    }

    dispatch('wait/start', 'author.pages.load', { root: true });
    try {
      const json = await http_api
        .url(uri.href())
        .get()
        .json()
      ;
      const transformer = new Transformer();
      commit('setPages', {
        meta: json.meta,
        data: transformer.deserialize(Page, json)
      });
    } catch (error) {
      commit('setError', error);
    } finally {
      dispatch('wait/end', 'author.pages.load', { root: true });
    }
  },
  /**
   * Read a page.
   */
  async read({getters, dispatch, commit, state}, { id }) {
    // Don't read it again when it is already current...
    if (state.current?.id === id) {
      return;
    }
    // When it is available in the cache, set it as current...
    const page = getters['page'](id);
    if (page) { // already read
      commit('setCurrent', page);
      return;
    }

    let uri = new URI('author/pages');
    uri.segment(id);

    dispatch('wait/start', 'author.pages.read', { root: true });
    try {
      const json = await http_api
        .url(uri.href())
        .get()
        .json()
      ;
      const transformer = new Transformer();
      commit('setCurrent', transformer.deserialize(Page, json));
    } catch (error) {
      commit('setError', error);
      throw error;
    } finally {
      dispatch('wait/end', 'author.pages.read', { root: true });
    }
  },
  async create({ commit }) {
    commit('setCurrent', new Page());
  },
  /**
   * Save a page.
   */
  async save({ dispatch, commit }, page) {
    let uri = new URI('author/pages');
    if (page.id) uri.segment(page.id);

    const transformer = new Transformer();
    const data = transformer.serialize(page);

    try {
      dispatch('wait/start', 'author.pages.save', { root: true });

      let api = http_api.url(uri.href()).json(data);
      const res = await page.id ? api.patch() : api.post();
      let newPage = transformer.deserialize(Page, await res.json());

      commit('setPage', newPage);
      commit('setCurrent', newPage);

      return newPage;
    } catch (error) {
      commit('setError', error);
      throw error;
    } finally {
      dispatch('wait/end', 'author.pages.save', { root: true });
    }
  },
  /**
   * When a page was read in another store, setCurrent can be
   * used to make it available in this store.
   */
  setCurrent({ commit }, page) {
    commit('setCurrent', page);
  },
};

export default {
  namespaced: true,
  state: initialize(),
  getters,
  mutations,
  actions
};
