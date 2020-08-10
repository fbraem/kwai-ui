import { ref, computed } from '@vue/composition-api';
import URI from 'urijs';
import { http_api } from '@/js/http';
import Season from '@/models/Season';
import Transformer from '@/js/jsonapi/Transformer';

function createURI() {
  return new URI('seasons');
}

/**
 * State management for Season.
 */
export default function useSeasons() {
  const loading = ref(false);
  const saving = ref(false);
  const all = ref([]);
  const current = ref();
  const error = ref();

  /**
   * Load all seasons
   */
  async function load(reload = false) {
    error.value = null;
    if (!reload && all.value.length > 0) return;

    const uri = createURI();
    try {
      loading.value = true;
      const json = await http_api
        .url(uri.href())
        .get()
        .json()
      ;
      all.value = (new Transformer()).deserialize(Season, json);
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Read the season.
   * @param id
   */
  async function read(id) {
    error.value = null;

    // Don't read it again
    if (current.value?.id === id) return;

    // See if it was already loaded
    current.value = all.value.find((s) => s.id === id);
    if (current.value) return;

    const uri = createURI();
    uri.segment(id);

    try {
      loading.value = true;
      const json = await http_api
        .url(uri.href())
        .get()
        .json()
      ;
      current.value = (new Transformer()).deserialize(Season, json);
    } catch (e) {
      current.value = null;
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Save the season
   */
  async function save(season) {
    error.value = null;
    const transformer = new Transformer();
    const uri = createURI();
    if (season.id) uri.segment(season.id);
    const api = http_api
      .url(uri.href())
      .json(transformer.serialize(season))
    ;

    try {
      saving.value = true;
      const res = await season.id ? api.patch() : api.post();
      current.value = transformer.deserialize(Season, await res.json());
      if (!season.id) all.value.push(current.value);
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      saving.value = false;
    }
  }

  /**
   * Clear all seasons
   */
  function reset() {
    all.value = [];
    current.value = null;
    error.value = null;
    loading.value = false;
  }

  return {
    all: computed(() => all.value),
    count: computed(() => all.value.length),
    current: computed(() => current.value),
    error: computed(() => error.value),
    isLoading: computed(() => loading.value),
    isSaving: computed(() => saving.value),
    load,
    read,
    reset,
    save
  };
};
