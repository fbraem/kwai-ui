const App = () => import(
  /* webpackChunkName: "author_chunk" */
  './App'
);
const News = () => import(
  /* webpackChunkName: "author_chunk" */
  './News'
);
const NewsForm = () => import(
  /* webpackChunkName: "author_chunk" */
  './NewsForm.vue'
);
const Pages = () => import(
  /* webpackChunkName: "author_chunk" */
  './Pages'
);
const PageForm = () => import(
  /* webpackChunkName: "author_chunk" */
  './PageForm.vue'
);

import Story from '@/models/Story';
import Page from '@/models/Page';

export default [
  {
    path: '/author',
    component: App,
    children: [
      {
        name: 'author.news.update',
        path: 'news/update/:id(\\d+)',
        component: NewsForm,
        props: {
          creating: false
        },
        meta: {
          auth: {
            action: 'update',
            subject: Story
          }
        },
      },
      {
        name: 'author.news.create',
        path: 'news/create',
        component: NewsForm,
        props: {
          creating: true
        },
        meta: {
          auth: {
            action: 'create',
            subject: Story
          }
        },
      },
      {
        name: 'author.news',
        path: 'news',
        component: News,
        meta: {
          auth: {
            subject: Story
          }
        },
      },
      {
        name: 'author.pages',
        path: 'pages',
        component: Pages,
        meta: {
          auth: {
            subject: Page
          }
        }
      },
      {
        name: 'author.pages.update',
        path: 'pages/update/:id(\\d+)',
        component: PageForm,
        props: {
          creating: false
        },
        meta: {
          auth: {
            action: 'update',
            subject: Page
          }
        },
      },
      {
        name: 'author.pages.create',
        path: 'pages/create',
        component: PageForm,
        props: {
          creating: true
        },
        meta: {
          auth: {
            action: 'create',
            subject: Page
          }
        },
      },
      {
        path: '',
        name: 'author.home',
        redirect: {
          name: 'author.news'
        }
      },
    ]
  },
];
