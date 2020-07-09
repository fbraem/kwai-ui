import Vue from 'vue';
import URI from 'urijs';
import { http_api } from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import Story from '@/models/Story';

export const initialize = () => ({
  cache: {},
  count: 0,
  error: null,
  current: null
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
  },
};

export const mutations = {
  setStories(state, { meta, data }) {
    state.error = null;
    Vue.set(state.cache, meta.offset, data);
    state.count = meta.count;
  },
  /**
   * When the story is already loaded in the cache, update it
   */
  setStory(state, story) {
    for (const [, stories] of Object.entries(state.cache)) {
      const index = stories.findIndex(s => s.id === story.id);
      if (index !== -1) {
        Vue.set(stories, index, story);
        break;
      }
    }
  },
  setError(state, error) {
    state.error = error;
  },
  /**
   * Set the current story
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
    { offset = 0, limit = 10, application, enabled, reload = false }
  ) {
    if (!reload && state.cache[offset]) return;

    let uri = new URI('author/stories');
    if (offset > 0) {
      uri.addQuery({ 'page[offset]': offset });
    }
    uri.addQuery({ 'page[limit]': limit });
    if (application) {
      uri.addQuery({ 'filter[application]': application });
    }
    if (enabled) {
      uri.addQuery({ 'filter[enabled}': true });
    }

    dispatch('wait/start', 'author.news.load', { root: true });
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
      dispatch('wait/end', 'author.news.load', { root: true });
    }
  },
  /**
   * Read a news story.
   */
  async read({getters, dispatch, commit, state}, { id }) {
    // Don't read it again when it is already current...
    console.log(state.current, id);
    if (state.current?.id === id) {
      return;
    }
    // When it is available in the cache, set it as current...
    const story = getters['story'](id);
    if (story) { // already read
      commit('setCurrent', story);
      return;
    }

    let uri = new URI('author/stories');
    uri.segment(id);

    dispatch('wait/start', 'author.news.read', { root: true });
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
      dispatch('wait/end', 'author.news.read', { root: true });
    }
  },
  async create({ commit }) {
    commit('setCurrent', new Story());
  },
  /**
   * Save a news story.
   */
  async save({ commit }, story) {
    let uri = new URI('author/stories');
    if (story.id) uri.segment(story.id);

    const transformer = new Transformer();
    const data = transformer.serialize(story);

    try {
      let api = http_api.url(uri.href()).json(data);
      const res = await story.id ? api.patch() : api.post();
      let newStory = transformer.deserialize(Story, await res.json());

      commit('setStory', newStory);
      commit('setCurrent', newStory);

      return newStory;
    } catch (error) {
      commit('setError', error);
      throw error;
    }
  },
  /**
   * When a story was read in another instance of this module, setCurrent can be
   * used to make it available in the current instance.
   */
  setCurrent({ commit }, story) {
    console.log('current', story);
    commit('setCurrent', story);
  },
};

export default {
  namespaced: true,
  state: initialize(),
  getters,
  mutations,
  actions
};
