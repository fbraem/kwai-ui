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
  const load = useAPI(async(reload = false) => {
    if (!reload && all.value.length > 0) return all;

    const json = await http_team_categories_api.get().json();
    all.value = (new Transformer()).deserialize(TeamCategory, json);

    return all;
  });

  const read = useAPI(async(id) => {
    // Don't read it again
    if (current.value?.id === id) return current;

    // See if it was already loaded
    current.value = all.value.find((t) => t.id === id);
    if (current.value) return current;

    const json = await http_team_categories_api.url(`/${id}`)
      .get()
      .json()
    ;

    current.value = (new Transformer()).deserialize(TeamCategory, json);
    return current;
  });

  const save = useAPI(async(category) => {
    const transformer = new Transformer();

    let api = http_team_categories_api;
    if (category.id) api = api.url(`/${category.id}`);
    api = api.json(transformer.serialize(category));

    const res = await (category.id ? api.patch() : api.post());
    current.value = transformer.deserialize(TeamCategory, await res.json());
    if (!category.id) all.value.push(current.value);

    return current;
  });

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
    load,
    read,
    save
  };
}

const TeamCategoriesSymbol = Symbol();
export function useTeamCategoryStore() {
  return inject(TeamCategoriesSymbol);
}

export function provideTeamCategoryStore() {
  provide(TeamCategoriesSymbol, useTeamCategories());
}
