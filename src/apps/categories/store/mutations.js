import Vue from 'vue';

import { state as initialize } from './state';

/**
 * Set categories
 */
function categories(state, { meta, data }) {
  state.all = data;
  state.meta = meta;
  state.error = null;
}

/**
 * Set category
 */
function category(state, { data }) {
  state.error = null;
  if (state.all) {
    var index = state.all.findIndex((c) => c.id === data.id);
    if (index !== -1) {
      Vue.set(state.all, index, data);
    }
  }
  state.active = data;
}

function deleteCategory(state, category) {
  state.all = state.all.filter((c) => {
    return category.id !== c.id;
  });
  state.error = null;
}

const active = (state, data) => {
  state.error = null;
  state.active = data;
};

function error(state, error) {
  state.error = error;
}

function reset(state) {
  Object.assign(state, initialize());
}

/**
 * Mutations
 */
export const mutations = {
  categories,
  category,
  deleteCategory,
  active,
  error,
  reset,
};
