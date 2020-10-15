import { http_api } from '@/js/http';
import {inject, provide, ref, computed} from '@vue/composition-api';
import Transformer from '@/js/jsonapi/Transformer';
import {useAPI} from '@/js/useAPI';
import Story from '@/models/Story';

const http_news_api = http_api.url('admin');

export default function createNewsService() {
  const all = ref([]);
  const count = ref(0);

  const load = useAPI(async(
    { offset = 0, limit = 10, user},
    reload = false
  ) => {
    if (!reload && all.value.length > 0) return all;

    let api = http_news_api.url(`/${user}/news`);
    if (offset > 0) {
      api = api.query({ 'page[offset]': offset });
    }
    api = api.query({ 'page[limit]': limit });

    const json = await api
      .get()
      .json()
    ;
    count.value = json.meta['count'];
    all.value = (new Transformer()).deserialize(Story, json);
    return all;
  });

  function reset() {
    all.value = [];
    count.value = 0;
  }

  return {
    all: computed(() => all.value),
    count: computed(() => count.value),
    load,
    reset,
  };
}

const UserNewsSymbol = Symbol();

export function useNewsStore() {
  return inject(UserNewsSymbol);
}

export function provideNewsStore() {
  provide(UserNewsSymbol, createNewsService());
}
