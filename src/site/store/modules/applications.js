import Application from '@/models/Application';
import JSONAPI from '@/js/JSONAPI';

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

    dispatch('wait/start', 'core.applications.load', { root: true });
    try {
      let api = new JSONAPI({
        source: Application,
        app: 'site'
      });
      let result = await api.get();
      commit('setApplications', result);
    } catch(error) {
      commit('setError', error);
    }
    finally {
      dispatch('wait/end', 'core.applications.load', { root: true });
    }
  }
}

export default {
  namespaced: true,
  state: initialize(),
  getters,
  mutations,
  actions
};
