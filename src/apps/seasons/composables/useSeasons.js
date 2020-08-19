import {ref, computed, inject, provide} from '@vue/composition-api';
import { http_api } from '@/js/http';
import Season from '@/models/Season';
import Transformer from '@/js/jsonapi/Transformer';
import { useAPI } from '@/js/useAPI';

const http_seasons_api = http_api.url('seasons');

/**
 * State management for Season.
 * @return {Object}
 */
export default function useSeasons() {
  const all = ref([]);
  const current = ref();

  /**
   * Load all seasons.
   * @param {boolean} reload
   * @returns {Array}
   */
  async function load(reload = false) {
    if (!reload && all.value.length > 0) return all.value;

    const json = await http_seasons_api
      .get()
      .json()
    ;
    all.value = (new Transformer()).deserialize(Season, json);
    return all.value;
  }

  /**
   * Read the season.
   * @param {int} id
   */
  async function read(id) {
    // Don't read it again
    if (current.value?.id === id) return current.value;

    // See if it was already loaded
    current.value = all.value.find((s) => s.id === id);
    if (current.value) return current.value;

    const json = await http_seasons_api
      .url(`/${id}`)
      .get()
      .json()
    ;
    current.value = (new Transformer()).deserialize(Season, json);
    return current.value;
  }

  /**
   * Save the season
   * @param {Season} season
   * @return {Season}
   */
  async function save(season) {
    const transformer = new Transformer();

    let api = http_seasons_api;
    if (season.id) api = api.url(`/${season.id}`);
    api.json(transformer.serialize(season));

    const res = await (season.id ? api.patch() : api.post());
    current.value = transformer.deserialize(Season, await res.json());
    if (!season.id) all.value.push(current.value);

    return current.value;
  }

  function asOptions() {
    return all.value.reduce(
      (result, season) => {
        result[season.id] = season.name;
        return result;
      },
      {}
    );
  }

  /**
   * Clear all seasons
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
    load: useAPI(load),
    read: useAPI(read),
    reset,
    save: useAPI(save)
  };
};

const SeasonsSymbol = Symbol();

export function useSeasonStore() {
  return inject(SeasonsSymbol);
}

export function provideSeasonStore() {
  provide(SeasonsSymbol, useSeasons());
}
