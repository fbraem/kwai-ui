import { ref, computed, provide, inject } from '@vue/composition-api';
import { http_api } from '@/js/http';
import TeamCategory from '@/models/TeamCategory';
import Transformer from '@/js/jsonapi/Transformer';
import { useAPI } from '@/js/useAPI';

const http_team_categories_api = http_api.url('team_categories');

export default function useTeamCategories() {
  const all = ref([]);
  const current = ref();

  /**
   * Load team categories
   * @param {boolean} reload
   */
  async function load(reload = false) {
    if (!reload && all.value.length > 0) return all.value;

    const json = await http_team_categories_api.get().json();
    all.value = (new Transformer()).deserialize(TeamCategory, json);

    return all.value;
  }

  function asOptions() {
    return all.value.reduce(
      (result, category) => {
        result[category.id] = category.name;
        return result;
      },
      {}
    );
  }

  return {
    all: computed(() => all.value),
    count: computed(() => all.value.length),
    current: computed(() => current.value),
    asOptions: computed(() => asOptions()),
    load: useAPI(load)
  };
}

const TeamCategoriesSymbol = Symbol();
export function useTeamCategoryStore() {
  return inject(TeamCategoriesSymbol);
}

export function provideTeamCategoryStore() {
  provide(TeamCategoriesSymbol, useTeamCategories());
}
