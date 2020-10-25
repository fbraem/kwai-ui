import {http_api} from '@/js/http';
import {inject, provide, computed, ref} from '@vue/composition-api';
import Application from '@/models/Application';
import Transformer from '@/js/jsonapi/Transformer';
import {useAPI} from '@/js/useAPI';

const http_applications_api = http_api.url('portal/applications');

// TODO: for now this must be global. One day this will be replaced by SWRV
// See: https://github.com/Kong/swrv
let all = null;

export default function createApplicationService() {
  all = ref([]);
  const current = ref(null);

  const load = useAPI(async() => {
    const transformer = new Transformer();

    const json = await http_applications_api.get().json();
    all.value = transformer.deserialize(Application, json);
    return all;
  });

  const get = (name) => {
    current.value = all.value.find(
      a => a.name === name
    );
  };

  return {
    all: computed(() => all.value),
    current: computed(() => current.value),
    load,
    get
  };
}

const ApplicationSymbol = Symbol();

export function useApplicationStore() {
  return inject(ApplicationSymbol);
}

export function provideApplicationStore() {
  provide(ApplicationSymbol, createApplicationService());
}
