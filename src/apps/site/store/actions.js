import JSONAPI from '@/js/JSONAPI';
import NewsStory from '@/models/NewsStory';

async function load({ dispatch, commit }) {
  dispatch('wait/start', 'site.load', { root: true });

  try {
    let api = new JSONAPI({ source: NewsStory, app: 'site' });
    let result = await api.get();
    commit('news', result);
  } catch (error) {
    commit('error', error);
    throw error;
  } finally {
    dispatch('wait/end', 'site.load', { root: true });
  }
}

export const actions = {
  load
};
