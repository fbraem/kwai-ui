import App from './App.vue';

const NewsHeader = () => import(
  /* webpackChunkName: "news_chunk" */
  '@/apps/news/TheNewsHeader.vue'
);
const NewsStoryHeader = () => import(
  /* webpackChunkName: "news_chunk" */
  '@/apps/news/TheNewsStoryHeader.vue'
);
const NewsCategoryHeader = () => import(
  /* webpackChunkName: "news_chunk" */
  '@/apps/news/TheNewsCategoryHeader.vue'
);
const NewsArchiveHeader = () => import(
  /* webpackChunkName: "news_chunk" */
  '@/apps/news/TheNewsArchiveHeader.vue'
);
const NewsRead = () => import(
  /* webpackChunkName: "news_chunk" */
  '@/apps/news/NewsRead.vue'
);
const NewsBrowse = () => import(
  /* webpackChunkName: "news_chunk" */
  '@/apps/news/NewsBrowse.vue'
);

export default [
  {
    path: '/news',
    component: App,
    children: [
      {
        path: ':id(\\d+)',
        components: {
          hero: NewsStoryHeader,
          default: NewsRead
        },
        name: 'news.story',
      },
      {
        path: 'category/:category(\\d+)',
        components: {
          hero: NewsCategoryHeader,
          default: NewsBrowse
        },
        name: 'news.category',
      },
      {
        path: 'archive/:year(\\d+)/:month(\\d+)',
        components: {
          hero: NewsArchiveHeader,
          default: NewsBrowse
        },
        name: 'news.archive',
      },
      {
        path: '',
        components: {
          hero: NewsHeader,
          default: NewsBrowse
        },
        name: 'news',
      },
    ]
  },
];
