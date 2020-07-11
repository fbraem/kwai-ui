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

import Story from '@/models/Story';

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
        path: '',
        name: 'author.home',
        redirect: {
          name: 'author.news'
        }
      },
    ]
  },
];
