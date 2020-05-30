import config from 'config';

/**
 * Kwai store
 */
const initialize = () => ({
  page: {
    title: config.title,
    subTitle: ''
  },
  facebook: config.facebook,
  error: null,
  mail: config.mail,
  url: config.site,
  location: config.location
});

export default {
  namespaced: true,
  state: initialize(),
};
