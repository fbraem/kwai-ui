import Vue from 'vue';
import JSONAPI from './JSONAPI';

export default function makeModelStore({
  model,
  state,
  mutations,
  getters,
  actions
}) {
  // Some object arguments are extra state, mutations, ... for the module
  // To avoid name colissions, we put them in a separate object for now.
  let extra = {
    state,
    mutations,
    getters,
    actions
  };
  let module = {
    namespaced: true,
    modules: {},
    state() {
      let newState = {
        all: null,
        active: null,
        meta: null,
        error: null,
      };
      if (extra.state) {
        newState = { ...newState, ...extra.state() };
      }
      return newState;
    },
    getters: {
      entity(state) {
        return function(id) {
          return state.all?.find((entity) => entity.id === id);
        };
      }
    },
    mutations: {
      all(state, { meta, data }) {
        state.all = data;
        state.error = null;
      },
      set(state, { data }) {
        if (state.all) {
          var index = state.all.findIndex((entity) => entity.id === data.id);
          if (index !== -1) {
            Vue.set(state.all, index, data);
          }
        }
        state.error = null;
      },
      active(state, data) {
        state.active = data;
      },
      error(state, data) {
        state.error = data;
      },
      reset(state) {
        Object.assign(state, module.state());
      }
    },
    actions: {
      async browse({ dispatch, commit }, payload) {
        const wait = model.type() + '.browse';
        dispatch('wait/start', wait, { root: true });
        try {
          var api = new JSONAPI({ source: model });
          let result = await api.get();
          commit('all', result);
        } catch (error) {
          commit('error', error);
          throw error;
        } finally {
          dispatch('wait/end', wait, { root: true });
        }
      },
      async read({ dispatch, getters, commit, state }, payload) {
        if (state.active?.id === payload.id) {
          return;
        }

        var entity = getters['entity'](payload.id);
        if (entity) { // already read
          commit('active', entity);
          return;
        }

        const wait = model.type() + '.read';
        dispatch('wait/start', wait, { root: true });
        try {
          var api = new JSONAPI({ source: model });
          var result = await api.get(payload.id);
          commit('active', result.data);
        } catch (error) {
          commit('error', error);
          throw error;
        } finally {
          dispatch('wait/end', wait, { root: true });
        }
      },
      async save({ dispatch, commit }, rule) {
        try {
          const api = new JSONAPI({ source: model });
          const result = await api.save(rule);
          commit('set', result);
          return result.data;
        } catch (error) {
          commit('error', error);
          throw error;
        }
      },
      set({dispatch, commit}, entity) {
        commit('set', entity);
      },
      create({ commit }) {
        /*eslint new-cap: ["error", { "newIsCap": false }]*/
        commit('active', new model);
      }
    }
  };
  if (extra.mutations) {
    module.mutations = { ...module.mutations, ...extra.mutations};
  }
  if (extra.getters) {
    module.getters = { ...module.getters, ...extra.getters};
  }
  if (extra.actions) {
    module.actions = { ...module.actions, ...extra.actions};
  }
  return module;
};
