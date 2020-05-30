import wretch from 'wretch';

import config from 'config';

import store from '@/site/store';

export const http = wretch(config.api);

export const http_auth = http.defer((w, url, options) => {
  const token = store.state.authentication.access_token;
  if (token) {
    return w.auth(`Bearer ${token}`);
  }
  return w;
});

export const http_api = http_auth
  .accept('application/vnd.api+json')
  .content('application/vnd.api+json')
  .catcher(401, async(_, request) => {
    await store.dispatch('auth/refresh');
    const token = store.state.authentication.access_token;
    return request.auth(token).replay().json();
  })
;
