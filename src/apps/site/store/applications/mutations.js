import { state as initialize } from './state';

function error(state, error) {
  state.error = error;
}

function applications(state, { data }) {
  state.all = data;
}

function reset(state) {
  Object.assign(state, initialize());
}

export const mutations = {
  error,
  applications,
  reset
};
