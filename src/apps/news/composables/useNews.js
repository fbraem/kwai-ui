import { http_api } from '@/js/http';
import {inject, provide, ref, computed} from '@vue/composition-api';
import Transformer from '@/js/jsonapi/Transformer';
import {useAPI} from '@/js/useAPI';
import Story from '@/models/Story';

const http_news_api = http_api.url('news');

export default function createNewsService() {
  const all = ref([]);
  const archive = ref([]);
  const count = ref(0);
  const current = ref();

  const load = useAPI(async(
    { offset = 0, limit = 10, application, year, month, promoted, user },
    reload = false
  ) => {
    if (!reload && all.value.length > 0) return all;

    let api = http_news_api.url('/stories');
    if (offset > 0) {
      api = api.query({ 'page[offset]': offset });
    }
    api = api.query({ 'page[limit]': limit });
    if (year) {
      api = api.query({ 'filter[year]': year });
    }
    if (month) {
      api = api.query({ 'filter[month]': month });
    }
    if (promoted) {
      api = api.query({ 'filter[promoted]': true });
    }
    if (user) {
      api = api.query({ 'filter[user]': user });
    }
    if (application) {
      api = api.query({ 'filter[application]': application });
    }
    const json = await api
      .get()
      .json()
    ;
    count.value = json.meta['count'];
    all.value = (new Transformer()).deserialize(Story, json);
    return all;
  });

  const read = useAPI(async(id) => {
    // Don't read it again
    if (current.value?.id === id) return current;

    // See if it was already loaded
    current.value = all.value.find((c) => c.id === id);
    if (current.value) return current;

    const json = await http_news_api
      .url(`/stories/${id}`)
      .get()
      .json()
    ;
    current.value = (new Transformer()).deserialize(Story, json);
    return current;
  });

  const loadArchive = useAPI(async() => {
    if (archive.value.length > 0) return archive;

    archive.value = await http_news_api
      .url('/archive')
      .get()
      .json()
    ;

    return archive;
  });

  function reset() {
    all.value = [];
    current.value = null;
    archive.value = [];
  }

  return {
    all: computed(() => all.value),
    archive: computed(() => archive.value),
    count: computed(() => all.value.length),
    current,
    fullCount: computed(() => count.value),
    load,
    loadArchive,
    read,
    reset,
  };
}

const NewsSymbol = Symbol();

export function useNewsStore() {
  return inject(NewsSymbol);
}

export function provideNewsStore() {
  provide(NewsSymbol, createNewsService());
}
