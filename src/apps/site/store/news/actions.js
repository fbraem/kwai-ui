import JSONAPI from '@/js/JSONAPI';
import NewsStory from '@/models/NewsStory';

async function load({ dispatch, commit, getters }, payload = {}) {
  dispatch('wait/start', 'site.news.load', { root: true });

  // First check if the stories were already loaded.
  let offset = payload.offset ?? 0;
  let cached = getters['stories'](offset);
  if (cached) {
    commit('offset', offset);
    return;
  }

  let api = new JSONAPI({ source: NewsStory, app: 'site' });
  api.paginate(payload);
  try {
    let result = await api.get();
    commit('news', result);
  } catch (error) {
    commit('error', error);
    throw error;
  } finally {
    dispatch('wait/end', 'site.news.load', { root: true });
  }
}

export const actions = {
  load
};
