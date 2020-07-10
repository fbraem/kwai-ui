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
      },
      {
        name: 'author.news.create',
        path: 'news/create',
        component: NewsForm,
        props: {
          creating: true
        },
      },
      {
        name: 'author.news',
        path: 'news',
        component: News
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
