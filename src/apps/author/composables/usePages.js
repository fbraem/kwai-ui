import createPageService from '@/apps/pages/composables/usePages';
import {useAPI} from '@/js/useAPI';
import {http_api} from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import {inject, provide} from '@vue/composition-api';
import Page from '@/models/Page';

const http_author_api = http_api.url('author');

export default function createAuthorPageService() {
  const pageService = createPageService();

  const save = useAPI(async(page) => {
    const transformer = new Transformer();
    let api = http_author_api;
    if (page.id) api = api.url(`/pages/${page.id}`);
    api = api.json(transformer.serialize(page));

    const res = await (page.id ? api.patch() : api.post());
    pageService.current.value = transformer.deserialize(Page, await res.json());

    return pageService.current;
  });

  return {
    ...pageService,
    save
  };
}

const AuthorPageSymbol = Symbol();

export function useAuthorPageStore() {
  return inject(AuthorPageSymbol);
}

export function provideAuthorPageStore() {
  provide(AuthorPageSymbol, createAuthorPageService());
}
