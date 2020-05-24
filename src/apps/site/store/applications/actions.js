import JSONAPI from '@/js/JSONAPI';
import Applications from '@/models/Application';

async function load({ dispatch, commit, state }) {
  dispatch('wait/start', 'site.applications.load', { root: true });

  if (state.all.length > 0) {
    // Already loaded.
    return;
  }

  let api = new JSONAPI({ source: Applications, app: 'site' });
  try {
    let result = await api.get();
    commit('applications', result);
  } catch (error) {
    commit('error', error);
    throw error;
  } finally {
    dispatch('wait/end', 'site.applications.load', { root: true });
  }
}

export const actions = {
  load
};
