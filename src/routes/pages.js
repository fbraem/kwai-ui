import App from '@/site/App.vue';

const PagesHeader = () => import(
  /* webpackChunkName: "pages_chunck" */ '@/apps/pages/PagesHeader.vue');
const PageHeader = () => import(
  /* webpackChunkName: "pages_chunck" */ '@/apps/pages/PageHeader.vue');
const PageCategoryHeader = () => import(
  /* webpackChunkName: "pages_chunck" */ '@/apps/pages/PageCategoryHeader.vue');
const PageFormHeader = () => import(
  /* webpackChunkName: "pages_chunck" */ '@/apps/pages/PageFormHeader.vue');
const PageRead = () => import(
/* webpackChunkName: "pages_chunck" */ '@/apps/pages/PageRead.vue');
const PageBrowse = () => import(
/* webpackChunkName: "pages_chunck" */ '@/apps/pages/PageBrowse.vue');
const PageForm = () => import(
  /* webpackChunkName: "pages_admin" */ '@/apps/pages/PageForm.vue');

const CategoryStore = () =>
  import(/* webpackChunkName: "category_chunck" */ '@/stores/categories'
  );
const PageStore = () =>
  import(/* webpackChunkName: "news_chunck" */ '@/stores/pages'
  );

export default [
  {
    path: '/pages',
    component: App,
    meta: {
      stores: [
        {
          ns: [ 'category' ],
          create: CategoryStore
        },
        {
          ns: [ 'page' ],
          create: PageStore
        },
      ]
    },
    children: [
      {
        path: ':id(\\d+)',
        components: {
          header: PageHeader,
          main: PageRead
        },
        name: 'pages.read',
      },
      {
        path: 'category/:category(\\d+)',
        components: {
          header: PageCategoryHeader,
          main: PageBrowse
        },
        name: 'pages.category',
      },
      {
        path: 'create',
        components: {
          header: PageFormHeader,
          main: PageForm
        },
        props: {
          header: {
            creating: true
          }
        },
        name: 'pages.create',
      },
      {
        path: 'update/:id(\\d+)',
        name: 'pages.update',
        components: {
          header: PageFormHeader,
          main: PageForm
        },
        props: {
          header: {
            creating: false
          }
        },
      },
      {
        path: '',
        components: {
          header: PagesHeader,
          main: PageBrowse
        },
        name: 'pages.browse',
      },
    ]
  },
];
