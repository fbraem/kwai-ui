import { ref, computed } from '@vue/composition-api';
import URI from 'urijs';
import { http_api } from '@/js/http';
import Season from '@/models/Season';
import Transformer from '@/js/jsonapi/Transformer';

/**
 * State management for Season.
 */
export default function useSeasons() {
  const loading = ref(false);
  const all = ref([]);
  const current = ref();
  const error = ref();

  /**
   * Load all seasons
   */
  async function load(reload = false) {
    if (!reload && all.value.length > 0) return;

    const uri = new URI('seasons');
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
    current.value = all.value.find((s) => s.id === id);
    if (current.value) return;

    const uri = new URI('seasons');
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
   * Clear all seasons
   */
  function reset() {
    all.value = [];
  }

  return {
    all: computed(() => all.value),
    count: computed(() => all.value.length),
    current: computed(() => current.value),
    error: computed(() => error.value),
    isLoading: computed(() => loading.value),
    load,
    read,
    reset
  };
};
