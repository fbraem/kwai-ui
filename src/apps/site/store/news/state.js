/**
 * State of the store
 */
export const state = () => {
  return {
    cache: {}, // Cached stories, offset is key
    offset: 0, // Current offset
    count: 0,  // Max. number of stories
    error: null
  };
};
