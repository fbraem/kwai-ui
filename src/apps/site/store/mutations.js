import { state as initialize } from './state';

function news(state, data) {
  state.news = data;
}

function reset(state) {
  Object.assign(state, initialize());
}

export const mutations = {
  news,
  reset
};
