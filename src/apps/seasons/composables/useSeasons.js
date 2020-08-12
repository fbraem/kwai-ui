import { ref, computed } from '@vue/composition-api';
import URI from 'urijs';
import { http_api } from '@/js/http';
import Season from '@/models/Season';
import Transformer from '@/js/jsonapi/Transformer';
import { useAPI } from '@/js/useAPI';

function createURI() {
  return new URI('seasons');
}

/**
 * State management for Season.
 */
export default function useSeasons() {
  const saving = ref(false);
  const all = ref([]);
  const current = ref();

  async function load(reload = false) {
    if (!reload && all.value.length > 0) return;

    const uri = createURI();
    const json = await http_api
      .url(uri.href())
      .get()
      .json()
    ;
    all.value = (new Transformer()).deserialize(Season, json);
    return all.value;
  }

  /**
   * Read the season.
   * @param id
   */
  async function read(id) {
    // Don't read it again
    if (current.value?.id === id) return;

    // See if it was already loaded
    current.value = all.value.find((s) => s.id === id);
    if (current.value) return current.value;

    const uri = createURI();
    uri.segment(id);

    const json = await http_api
      .url(uri.href())
      .get()
      .json()
    ;
    current.value = (new Transformer()).deserialize(Season, json);
    return current.value;
  }

  /**
   * Save the season
   */
  async function save(season) {
    const transformer = new Transformer();
    const uri = createURI();
    if (season.id) uri.segment(season.id);
    const api = http_api
      .url(uri.href())
      .json(transformer.serialize(season))
    ;

    const res = await season.id ? api.patch() : api.post();
    current.value = transformer.deserialize(Season, await res.json());
    if (!season.id) all.value.push(current.value);

    return current.value;
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
    isSaving: computed(() => saving.value),
    load: useAPI(load),
    read: useAPI(read),
    reset,
    save: useAPI(save)
  };
};
