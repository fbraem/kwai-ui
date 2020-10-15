import {inject, provide, ref, computed} from '@vue/composition-api';
import {useAPI} from '@/js/useAPI';
import {http_api} from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import Ability from '@/models/users/Ability';
import Team from '@/models/Team';

const http_abilities_api = http_api.url('admin/abilities');

export default function createAbilityService() {
  const all = ref({});
  const current = ref();
  const count = ref(0);

  const load = useAPI(async(reload = false) => {
    if (!reload && Object.keys(all.value).length > 0) {
      return;
    }

    const json = await http_abilities_api.get().json();
    all.value = (new Transformer()).deserialize(Ability, json)
      .reduce(
        (abilities, ability) => {
          abilities[ability.id] = ability;
          return abilities;
        },
        {}
      )
    ;
    count.value = json.meta?.count ?? Object.keys(all.value).length;
  });

  const read = useAPI(async(id) => {
    if (current.value?.id === id) return current;
    if (all.value[id]) {
      current.value = all.value[id];
      return current;
    }

    const json = await http_abilities_api.url(`/${id}`).get().json();

    current.value = (new Transformer()).deserialize(Ability, json);
    return current;
  });

  const save = useAPI(async(ability) => {
    const transformer = new Transformer();

    let api = http_abilities_api;
    if (ability.id) api = api.url(`/${ability.id}`);
    console.log(ability);
    api = api.json(transformer.serialize(ability));

    const json = await (ability.id ? api.patch() : api.post()).json();
    current.value = transformer.deserialize(Ability, json);
    if (!ability.id) all.value.push(current.value);

    return current;
  });

  return {
    all: computed(() => all.value),
    current: computed(() => current.value),
    count: computed(() => count.value),
    load,
    read,
    save
  };
};

const AbilitiesSymbol = Symbol();

export function useAbilityStore() {
  return inject(AbilitiesSymbol);
}

export function provideAbilityStore() {
  return provide(AbilitiesSymbol, createAbilityService());
}
