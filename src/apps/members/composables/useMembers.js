import {ref, computed, inject, provide} from '@vue/composition-api';
import { http_api } from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import { useAPI } from '@/js/useAPI';
import Member from '@/models/Member';

const http_members_api = http_api.url('sport/judo/members');

/**
 * State management for Coach.
 * @return {Object}
 */
export default function createMemberService() {
  const all = ref([]);
  const current = ref();

  /**
   * Load all members.
   * @param {boolean} reload
   * @returns {Array}
   */
  const load = useAPI(async({ name, active } = {}, reload = false) => {
    if (!reload && all.value.length > 0) return all;

    let api = http_members_api;
    if (name) {
      api = api.query({ 'filter[name]': name });
    }
    if (active) {
      api = api.query({ 'filter[active]': active });
    }

    const json = await api
      .get()
      .json()
    ;
    all.value = (new Transformer()).deserialize(Member, json);
    return all;
  });

  /**
   * Read the member.
   * @param {int} id
   */
  const read = useAPI(async(id) => {
    // Don't read it again
    if (current.value?.id === id) return current;

    // See if it was already loaded
    current.value = all.value.find((c) => c.id === id);
    if (current.value) return current;

    const json = await http_members_api
      .url(`/${id}`)
      .get()
      .json()
    ;
    current.value = (new Transformer()).deserialize(Member, json);
    return current;
  });

  /**
   * Clear all members
   */
  function reset() {
    all.value = [];
    current.value = null;
  }

  return {
    all: computed(() => all.value),
    count: computed(() => all.value.length),
    current: computed(() => current.value),
    load,
    read,
    reset
  };
};

const MembersSymbol = Symbol();

export function useMemberStore() {
  return inject(MembersSymbol);
}

export function provideMemberStore() {
  provide(MembersSymbol, createMemberService());
}
