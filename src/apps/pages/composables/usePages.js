import { http_api } from '@/js/http';
import {inject, provide, ref, computed} from '@vue/composition-api';
import Transformer from '@/js/jsonapi/Transformer';
import {useAPI} from '@/js/useAPI';
import Page from '@/models/Page';

const http_pages_api = http_api.url('pages');

export default function createPageService() {
  const all = ref([]);
  const count = ref(0);
  const current = ref();

  const load = useAPI(async(
    { offset = 0, limit = 10, application, user, sort },
    reload = false
  ) => {
    if (!reload && all.value.length > 0) return all;

    let api = http_pages_api;
    if (offset > 0) {
      api = api.query({ 'page[offset]': offset });
    }
    api = api.query({ 'page[limit]': limit });
    if (user) {
      api = api.query({ 'filter[user]': user });
    }
    if (application) {
      api = api.query({'filter[application]': application});
    }
    if (sort) {
      api = api.query({ sort });
    }

    const json = await api
      .get()
      .json()
    ;
    count.value = json.meta['count'];
    all.value = (new Transformer()).deserialize(Page, json);
    return all;
  });

  const read = useAPI(async(id) => {
    // Don't read it again
    if (current.value?.id === id) return current;

    // See if it was already loaded
    current.value = all.value.find((c) => c.id === id);
    if (current.value) return current;

    const json = await http_pages_api
      .url(`/${id}`)
      .get()
      .json()
    ;
    current.value = (new Transformer()).deserialize(Page, json);
    return current;
  });

  function reset() {
    all.value = [];
    current.value = null;
  }

  return {
    all: computed(() => all.value),
    count: computed(() => all.value.length),
    current,
    fullCount: computed(() => count.value),
    load,
    read,
    reset,
  };
}

const PagesSymbol = Symbol();

export function usePageStore() {
  return inject(PagesSymbol);
}

export function providePageStore() {
  provide(PagesSymbol, createPageService());
}
