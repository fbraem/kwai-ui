import wretch from 'wretch';

import config from 'config';

import createAuthenticationService from '@/site/composables/useAuthentication';

export const http = wretch(config.api, {
  options: {
    credentials: 'include',
    mode: 'cors'
  }
});

export const http_auth = http.defer(w => {
  const authService = createAuthenticationService();
  const token = authService.access_token?.value;
  if (token) {
    return w.auth(`Bearer ${token}`);
  }
  return w;
});

export const http_api = http_auth
  .accept('application/vnd.api+json')
  .content('application/vnd.api+json')
  .catcher(401, async(err, request) => {
    const authService = createAuthenticationService();
    await authService.refresh.run();
    if (!authService.access_token?.value) throw err;

    const token = authService.access_token?.value;
    return request
      .auth(token)
      .replay()
      .unauthorized(err => { throw err; })
      .json()
    ;
  })
;
