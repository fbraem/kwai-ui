import Vue from 'vue';

import OAuth from '@/js/oauth';
const oauth = new OAuth();
import axios from 'axios';

import Vuex from 'vuex';
Vue.use(Vuex);

import filter from 'lodash/filter';

import URI from 'urijs';
import moment from 'moment';

import Story from './models/Story';

const state = {
    stories : [],
    status : {
        loading : false,
        success : false,
        error : false
    },
    archive : {}
};

const getters = {
    stories(state) {
        return state.stories;
    },
    story: (state) => (id) => {
        return state.stories.find((story) => story.id == id);
    },
    loading(state) {
        return state.status.loading;
    },
    success(state) {
        return state.status.success;
    },
    error(state) {
        return state.status.error;
    },
    archive(state) {
        return state.archive;
    }
};

const mutations = {
  stories(state, stories) {
      state.stories = stories;
  },
  setStory(state, story) {
      var index = state.stories.findIndex((s) => s.id == story.id);
      if (state.stories[index]) Vue.set(state.stories, index, story);
  },
  deleteStory(state, data) {
      state.stories = filter(state.stories, (story) => {
         return story.id != data.id;
      });
  },
  archive(state, data) {
      state.archive = {};
      data.forEach((element) => {
          if (! state.archive[element.year]) {
              state.archive[element.year] = [];
          }
          state.archive[element.year].push({
              monthName : moment.months()[element.month - 1],
              month : element.month,
              year : element.year,
              count : element.count
          });
      });
  },
  loading(state) {
      state.status = {
          loading : true,
          success: false,
          error : false
      };
  },
  success(state) {
      state.status = {
          loading : false,
          success: true,
          error : false
      };
  },
  error(state, payload) {
      state.status = {
          loading : false,
          success: false,
          error : payload
      };
  }
};

const actions = {
    async browse(context, payload) {
        context.commit('loading');
        const story = new Story();
        const fetchStories = async () => {
            if (payload.category) {
                story.where('category', payload.category);
            }
            if (payload.year) {
                story.where('year', payload.year);
            }
            if (payload.month) {
                story.where('month', payload.month);
            }
            if (payload.featured) {
                story.where('featured', true);
            }
            if (payload.user) {
                story.where('user', payload.user);
            }
            let stories = await story.get();
            context.commit('stories', stories);
        };
        story.call(fetchStories);
        context.commit('success');
    },
    read(context, payload) {
        context.commit('loading');
        var story = context.getters['story'](payload.id);
        if (story) { // already read
            context.commit('success');
            return;
        }

        oauth.get('api/news/stories/' + payload.id, {
            data : payload
        }).then((res) => {
            var api = new JSONAPI();
            var result = api.parse(res.data);
            context.commit('setStory', {
                story : result.data
            });
            context.commit('success');
        }).catch((error) => {
            context.commit('error', error);
        });
    },
    create(context, payload) {
        context.commit('loading');
        return oauth.post('api/news/stories', {
            data : payload
        }).then((res) => {
            var api = new JSONAPI();
            var result = api.parse(res.data);
            context.commit('setStory', {
                story : result.data
            });
            context.commit('success');
            return result.data;
        }).catch((error) => {
            context.commit('error', error);
        });
    },
    update(context, payload) {
        context.commit('loading');
        return new Promise((resolve, reject) => {
            oauth.patch('api/news/stories/' + payload.data.id, {
                data : payload
            }).then((res) => {
                var api = new JSONAPI();
                var result = api.parse(res.data);
                context.commit('setStory', {
                    story : result.data
                });
                context.commit('success');
                resolve();
            }).catch((error) => {
                context.commit('error', error);
                reject();
            });
        });
    },
    delete(context, payload) {
        context.commit('loading');
        return new Promise((resolve, reject) => {
            oauth.delete('api/news/stories/' + payload.id)
            .then((res) => {
                context.commit('deleteStory', { id : payload.id });
                context.commit('success');
                resolve();
            }).catch((error) => {
                context.commit('error', error);
                reject();
            });
        });
    },
    uploadImage(context, payload) {
        //return axios.post('/api/news/image/' + payload.story.id, payload.formData);
        return oauth.post('/api/news/image/' + payload.story.id, {
            data : payload.formData
        });
    },
    embeddImage(context, payload) {
        return oauth.post('/api/news/embedded_image/' + payload.story.id, {
            data : payload.formData
        });
    },
    loadArchive(context, payload) {
        context.commit('loading');
        return new Promise((resolve, reject) => {
            oauth.get('api/news/archive', {
            }).then((res) => {
                context.commit('success');
                context.commit('archive', res.data);
            }).catch((error) => {
                context.commit('error', error);
            });
        });
    }
};

export default {
    namespaced : true,
    state : state,
    getters : getters,
    mutations : mutations,
    actions : actions,
    modules: {
    }
};
