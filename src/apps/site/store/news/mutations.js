import Vue from 'vue';
import { state as initialize } from './state';

function error(state, error) {
  state.error = error;
}

function news(state, { meta, data }) {
  Vue.set(state.cache, meta.offset, data);
  state.offset = meta.offset;
  state.count = meta.count;
}

function offset(state, offset) {
  state.offset = offset;
}

function reset(state) {
  Object.assign(state, initialize());
}

export const mutations = {
  error,
  news,
  offset,
  reset
};
