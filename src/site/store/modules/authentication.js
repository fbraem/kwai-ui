import Lockr from 'lockr';
import { http, http_auth } from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import User from '@/models/users/User';

const USER_KEY = 'user';
const USER_RULES_KEY = 'rules';
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const initialize = () => ({
  user: Lockr.get(USER_KEY, null),
  rules: Lockr.get(USER_RULES_KEY, []),
  access_token: Lockr.get(ACCESS_TOKEN_KEY, null),
  refresh_token: Lockr.get(REFRESH_TOKEN_KEY, null),
  error: null
});

const getters = {
  isLoggedIn: (state) => {
    return state.access_token != null;
  }
};

const mutations = {
  /**
   * Set the error
   */
  setError: (state, error) => {
    state.error = error;
  },
  /**
   * Set the access and refresh token
   */
  setLogin: (state, { access_token, refresh_token }) => {
    state.error = null;
    Lockr.set(ACCESS_TOKEN_KEY, access_token);
    state.access_token = access_token;
    Lockr.set(REFRESH_TOKEN_KEY, refresh_token);
    state.refresh_token = refresh_token;
  },
  /**
   * Set the current user with abilities
   */
  setUser: (state, user) => {
    state.error = null;
    let rules = [];
    if (user.abilities) {
      for (let ability of user.abilities) {
        for (let rule of ability.rules) {
          rules.push({
            actions: rule.action.name,
            subject: rule.subject.name
          });
        }
      }
    }
    Lockr.set(USER_RULES_KEY, rules);
    state.rules = rules;
    Lockr.set(USER_KEY, user);
    state.user = user;
  },
  /**
   * Set all data to null
   */
  setLogout: (state) => {
    state.error = null;
    Lockr.rm(USER_KEY);
    state.user = null;
    Lockr.rm(USER_RULES_KEY);
    state.rules = [];
    Lockr.rm(ACCESS_TOKEN_KEY);
    state.access_token = null;
    Lockr.rm(REFRESH_TOKEN_KEY);
    state.refresh_token = null;
  }
};

const actions = {
  /**
   * Login a user with email/password.
   */
  async login({ commit, dispatch }, { email, password }) {
    commit('setError', null);
    dispatch('wait/start', 'site.authentication.login', { root: true });
    try {
      const form = {
        username: email,
        password
      };
      const json = await http
        .url('user/login')
        .formData(form)
        .post()
        .json()
      ;
      commit('setLogin', json);
    } catch (error) {
      commit('setError', error);
      throw error;
    } finally {
      dispatch('wait/end', 'site.authentication.login', { root: true });
    }
  },
  /**
   * Get the current user
   */
  async user({ commit, dispatch }) {
    commit('setError', null);
    dispatch('wait/start', 'site.authentication.user', { root: true });
    try {
      const json = await http_auth
        .url('user')
        .get()
        .json()
      ;
      let user = new Transformer().deserialize(User, json);
      commit('setUser', user);
    } catch (error) {
      commit('setError', error);
      throw error;
    } finally {
      dispatch('wait/end', 'site.authentication.user', { root: true });
    }
  },
  /**
   * Logout the user
   */
  async logout({ commit, dispatch, state }) {
    commit('setError', null);
    const form = {
      refresh_token: state.refresh_token
    };
    dispatch('wait/start', 'site.authentication.logout', { root: true });
    try {
      await http_auth
        .url('user/logout')
        .formData(form)
        .post()
      ;
      commit('setLogout');
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 401) {
        commit('setLogout');
      } else {
        console.log(error);
      }
    } finally {
      dispatch('wait/end', 'site.authentication.logout', { root: true });
    }
  },
  /**
   * Use the refresh token to get a new access token.
   */
  async refresh({ commit, state }) {
    if (state.refresh_token) {
      const form = {
        refresh_token: state.refresh_token
      };
      const json = await http
        .url('user/acess_token')
        .formData(form)
        .post()
        .json()
      ;
      commit('setLogin', json);
    }
  }
};

export default {
  namespaced: true,
  state: initialize(),
  getters,
  mutations,
  actions
};
