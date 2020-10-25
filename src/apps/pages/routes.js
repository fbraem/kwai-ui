import App from './App.vue';

const PagesHeader = () => import(
  /* webpackChunkName: "pages_chunk" */
  '@/apps/pages/ThePagesHeader.vue'
);
const PageHeader = () => import(
  /* webpackChunkName: "pages_chunk" */
  '@/apps/pages/ThePageHeader.vue'
);
const PageCategoryHeader = () => import(
  /* webpackChunkName: "pages_chunk" */
  '@/apps/pages/ThePageCategoryHeader.vue'
);
const PageRead = () => import(
  /* webpackChunkName: "pages_chunk" */
  '@/apps/pages/PageRead.vue'
);
const PageBrowse = () => import(
  /* webpackChunkName: "pages_chunk" */
  '@/apps/pages/PageBrowse.vue'
);

export default [
  {
    path: '/pages',
    component: App,
    children: [
      {
        path: ':id(\\d+)',
        components: {
          hero: PageHeader,
          default: PageRead
        },
        name: 'pages.read',
      },
      {
        path: 'application/:application(\\d+)',
        components: {
          hero: PageCategoryHeader,
          default: PageBrowse
        },
        props: true,
        name: 'pages.application',
      },
      {
        path: '',
        components: {
          hero: PagesHeader,
          default: PageBrowse
        },
        name: 'pages.browse',
      },
    ]
  },
];
