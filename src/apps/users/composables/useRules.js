import {inject, provide, ref, computed} from '@vue/composition-api';
import {useAPI} from '@/js/useAPI';
import {http_api} from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import Rule from '@/models/users/Rule';

const http_abilities_api = http_api.url('admin/rules');

export default function createRuleService() {
  const all = ref({});
  const count = ref(0);

  const load = useAPI(async(reload = false) => {
    if (!reload && Object.keys(all.value).length > 0) {
      return;
    }

    const json = await http_abilities_api.get().json();
    all.value = (new Transformer()).deserialize(Rule, json)
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

  return {
    all: computed(() => all.value),
    load,
  };
};

const RulesSymbol = Symbol();

export function useRuleStore() {
  return inject(RulesSymbol);
}

export function provideRuleStore() {
  return provide(RulesSymbol, createRuleService());
}
