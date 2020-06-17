import Application from '@/models/Application';
import Transformer from '@/js/jsonapi/Transformer';
import { http_auth } from '@/js/http';

const initialize = () => ({
  all: [],
  meta: null,
  error: null
});

const getters = {
  application: (state) => (name) => {
    return state.all.find(a => a.name === name);
  }
};

const mutations = {
  setApplications(state, { meta, data }) {
    state.error = null;
    state.all = data;
    state.meta = meta;
  },
  setError(state, error) {
    state.error = error;
  },
  reset(state) {
    Object.assign(state, initialize());
  }
};

const actions = {
  async load({ state, commit, dispatch }) {
    if (state.all.length > 0) {
      return;
    }

    dispatch('wait/start', 'site.applications.load', { root: true });
    try {
      const json = await http_auth
        .url('site/applications')
        .get()
        .json()
      ;
      commit('setApplications', {
        data: new Transformer().deserialize(Application, json),
        meta: json.meta
      });
    } catch (error) {
      commit('setError', error);
    } finally {
      dispatch('wait/end', 'site.applications.load', { root: true });
    }
  }
};

export default {
  namespaced: true,
  state: initialize(),
  getters,
  mutations,
  actions
};
