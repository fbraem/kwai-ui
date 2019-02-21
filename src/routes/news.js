import App from '@/site/App.vue';

const NewsHeader = () => import(
  /* webpackChunkName: "news_chunck" */ '@/apps/news/NewsHeader.vue');
const NewsStoryHeader = () => import(
  /* webpackChunkName: "news_chunck" */ '@/apps/news/NewsStoryHeader.vue');
const NewsCategoryHeader = () => import(
    /* webpackChunkName: "news_chunck" */ '@/apps/news/NewsCategoryHeader.vue');
const NewsArchiveHeader = () => import(
  /* webpackChunkName: "news_chunck" */ '@/apps/news/NewsArchiveHeader.vue');
const NewsFormHeader = () => import(
  /* webpackChunkName: "news_admin" */ '@/apps/news/NewsFormHeader.vue');
const NewsRead = () => import(
  /* webpackChunkName: "news_chunck" */ '@/apps/news/NewsRead.vue');
const NewsBrowse = () => import(
  /* webpackChunkName: "news_chunck" */ '@/apps/news/NewsBrowse.vue');
const NewsForm = () => import(
  /* webpackChunkName: "news_admin" */ '@/apps/news/NewsForm.vue');

const CategoryStore = () =>
  import(/* webpackChunkName: "category_chunck" */ '@/stores/categories'
  );
const NewsStore = () =>
  import(/* webpackChunkName: "news_chunck" */ '@/stores/news'
  );

export default [
  {
    path: '/news',
    meta: {
      stores: [
        {
          ns: [ 'category' ],
          create: CategoryStore
        },
        {
          ns: [ 'news' ],
          create: NewsStore
        },
      ]
    },
    component: App,
    children: [
      {
        path: ':id(\\d+)',
        components: {
          header: NewsStoryHeader,
          main: NewsRead
        },
        name: 'news.story',
      },
      {
        path: 'category/:category(\\d+)',
        components: {
          header: NewsCategoryHeader,
          main: NewsBrowse
        },
        name: 'news.category',
      },
      {
        path: 'archive/:year(\\d+)/:month(\\d+)',
        components: {
          header: NewsArchiveHeader,
          main: NewsBrowse
        },
        name: 'news.archive',
      },
      {
        path: 'create',
        components: {
          header: NewsFormHeader,
          main: NewsForm
        },
        props: {
          header: {
            creating: true
          }
        },
        name: 'news.create',
      },
      {
        path: 'update/:id(\\d+)',
        components: {
          header: NewsFormHeader,
          main: NewsForm
        },
        props: {
          header: {
            creating: false
          }
        },
        name: 'news.update',
      },
      {
        path: '',
        components: {
          header: NewsHeader,
          main: NewsBrowse
        },
        name: 'news.browse',
      },
    ]
  },
];
