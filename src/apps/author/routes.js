import App from './App';
import Home from './Home';

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
        path: '',
        name: 'author.home',
        component: Home
      },
    ]
  },
];
