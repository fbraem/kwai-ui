import Vue from 'vue';

const setAbilities = (state, abilities) => {
  Vue.set(state.active, 'abilities', abilities);
};

export const mutations = {
  setAbilities,
};
