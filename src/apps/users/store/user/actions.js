import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import JSONAPI from '@/js/JSONAPI';

import User from '@/models/users/User';
import Ability from '@/models/users/Ability';

const readWithAbilities = async({ dispatch, commit }, { id }) => {
  const wait = User.type() + '.read.abilities';
  dispatch('wait/start', wait, { root: true });
  try {
    const api = new JSONAPI({ source: User });
    const result = await api.with('abilities').get(id);
    commit('active', result.data);
  } catch (error) {
    commit('error', error);
    throw error;
  } finally {
    dispatch('wait/end', wait, { root: true });
  }
};

const attachAbility = async({ dispatch, commit }, { user, ability }) => {
  const wait = User.type() + '.attach.ability';
  dispatch('wait/start', wait, { root: true });
  try {
    const api = new JSONAPI({ source: User, target: Ability });
    var result = await api.attach(user, ability);
    commit('setAbilities', { userId: user.id, abilities: result.data });
  } catch (error) {
    commit('error', error);
    throw error;
  } finally {
    dispatch('wait/end', wait, { root: true });
  }
};

const detachAbility = async({ dispatch, commit }, { user, ability }) => {
  const wait = User.type() + '.detach.ability';
  dispatch('wait/start', wait, { root: true });
  try {
    const api = new JSONAPI({ source: User, target: Ability });
    var result = await api.detach(user, ability);
    commit('setAbilities', { userId: user.id, abilities: result.data });
  } catch (error) {
    commit('error', error);
    throw error;
  } finally {
    dispatch('wait/end', wait, { root: true });
  }
};

const createWithToken = async({ state, getters, commit, context }, payload) => {
  var user = null;
  try {
    const api = new JSONAPI({ source: User});
    const result = api.custom({
      method: 'POST',
      path: payload.token,
      data: payload.user.serialize()
    });
    commit('user', result);
  } catch (error) {
    commit('error', error);
    throw error;
  }
  return user;
};

export const actions = {
  readWithAbilities,
  attachAbility,
  detachAbility,
  createWithToken
};
