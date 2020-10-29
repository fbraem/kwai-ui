import createNewsService from '@/apps/news/composables/useNews';
import {useAPI} from '@/js/useAPI';
import {http_api} from '@/js/http';
import Story from '@/models/Story';
import Transformer from '@/js/jsonapi/Transformer';
import {inject, provide} from '@vue/composition-api';

const http_author_api = http_api.url('author');

export default function createAuthorNewsService() {
  const newsService = createNewsService();

  const save = useAPI(async(story) => {
    const transformer = new Transformer();
    let api = http_author_api.url('/stories');
    if (story.id) api = api.url(`/${story.id}`);
    api = api.json(transformer.serialize(story));

    const res = await (story.id ? api.patch() : api.post());
    newsService.current.value = transformer.deserialize(Story, await res.json());

    return newsService.current;
  });

  return {
    ...newsService,
    save
  };
}

const AuthorNewsSymbol = Symbol();

export function useAuthorNewsStore() {
  return inject(AuthorNewsSymbol);
}

export function provideAuthorNewsStore() {
  provide(AuthorNewsSymbol, createAuthorNewsService());
}
