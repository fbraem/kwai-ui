const stories = (state) => (offset) => {
  return state.cache[offset];
}

export const getters = {
  stories
};
