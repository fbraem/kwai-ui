import {ref, computed, inject, provide} from '@vue/composition-api';
import { http_api } from '@/js/http';
import Coach from '@/models/trainings/Coach';
import Transformer from '@/js/jsonapi/Transformer';
import { useAPI } from '@/js/useAPI';

const http_coaches_api = http_api.url('trainings/coaches');

/**
 * State management for Coach.
 * @return {Object}
 */
export default function createCoachService() {
  const all = ref([]);
  const current = ref();

  /**
   * Load all coaches.
   * @param {boolean} reload
   * @returns {Array}
   */
  const load = useAPI(async(reload = false) => {
    if (!reload && all.value.length > 0) return all;

    const json = await http_coaches_api
      .get()
      .json()
    ;
    all.value = (new Transformer()).deserialize(Coach, json);
    return all;
  });

  /**
   * Read the coach.
   * @param {int} id
   */
  const read = useAPI(async(id) => {
    // Don't read it again
    if (current.value?.id === id) return current;

    // See if it was already loaded
    current.value = all.value.find((c) => c.id === id);
    if (current.value) return current;

    const json = await http_coaches_api
      .url(`/${id}`)
      .get()
      .json()
    ;
    current.value = (new Transformer()).deserialize(Coach, json);
    return current;
  });

  /**
   * Save the coach
   * @param {Coach} coach
   */
  const save = useAPI(async(coach) => {
    const transformer = new Transformer();

    let api = http_coaches_api;
    if (coach.id) api = api.url(`/${coach.id}`);
    api = api.json(transformer.serialize(coach));

    const res = await (coach.id ? api.patch() : api.post());
    current.value = transformer.deserialize(Coach, await res.json());
    if (!coach.id) all.value.push(current.value);

    return current;
  });

  function asOptions() {
    return all.value.reduce(
      (result, coach) => {
        result[coach.id] = coach.name;
        return result;
      },
      {}
    );
  }

  /**
   * Clear all coaches
   */
  function reset() {
    all.value = [];
    current.value = null;
  }

  return {
    all: computed(() => all.value),
    count: computed(() => all.value.length),
    current: computed(() => current.value),
    asOptions: computed(() => asOptions()),
    load,
    read,
    reset,
    save
  };
};

const CoachesSymbol = Symbol();

export function useCoachStore() {
  return inject(CoachesSymbol);
}

export function provideCoachStore() {
  provide(CoachesSymbol, createCoachService());
}
