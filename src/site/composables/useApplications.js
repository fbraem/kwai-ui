import {http_api} from '@/js/http';
import {inject, provide, computed, ref} from '@vue/composition-api';
import Application from '@/models/Application';
import Transformer from '@/js/jsonapi/Transformer';
import {useAPI} from '@/js/useAPI';
import Page from '@/models/Page';

const http_applications_api = http_api.url('portal/applications');

// TODO: for now this must be global. One day this will be replaced by SWRV
// See: https://github.com/Kong/swrv
let all = null;

export default function createApplicationService() {
  if (!all) all = ref([]);
  const current = ref(null);

  const load = useAPI(async() => {
    const transformer = new Transformer();

    const json = await http_applications_api.get().json();
    all.value = transformer.deserialize(Application, json);
    return all;
  });

  const read = useAPI(async(id) => {
    // Don't read it again
    if (current.value?.id === id) return current;

    // See if it was already loaded
    current.value = all.value.find((c) => c.id === id);
    if (current.value) return current;

    const json = await http_applications_api
      .url(`/${id}`)
      .get()
      .json()
    ;
    current.value = (new Transformer()).deserialize(Page, json);
    return current;
  });

  const get = (name) => {
    current.value = all.value.find(
      a => a.name === name
    );
  };

  function asOptions() {
    return all.value.reduce(
      (result, app) => {
        result[app.id] = app.title;
        return result;
      },
      {}
    );
  }

  return {
    all,
    current: computed(() => current.value),
    load,
    get,
    asOptions,
    read
  };
}

const ApplicationSymbol = Symbol();

export function useApplicationStore() {
  return inject(ApplicationSymbol);
}

export function provideApplicationStore() {
  provide(ApplicationSymbol, createApplicationService());
}
