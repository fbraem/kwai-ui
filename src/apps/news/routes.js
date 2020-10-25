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
        props: {
          hero: true,
          default: true
        },
        name: 'news.story',
      },
      {
        path: 'application/:application(\\d+)',
        components: {
          hero: NewsCategoryHeader,
          default: NewsBrowse
        },
        props: {
          hero: true,
          default: true
        },
        name: 'news.application',
      },
      {
        path: 'archive/:year(\\d+)/:month(\\d+)',
        components: {
          hero: NewsArchiveHeader,
          default: NewsBrowse
        },
        props: {
          hero: true,
          default: true
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
