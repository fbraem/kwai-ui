import App from './App.vue';

const CategoryRead = () => import(
  /* webpackChunkName: "category_chunk" */
  './CategoryRead.vue'
);
const CategoriesHeader = () => import(
  /* webpackChunkName: "category_chunk" */
  './TheCategoriesHeader.vue'
);
const CategoryBrowse = () => import(
  /* webpackChunkName: "category_chunk" */
  './CategoryBrowse.vue'
);

export default [
  {
    path: '/categories',
    component: App,
    children: [
      {
        path: ':id(\\d+)',
        component: CategoryRead,
        props: true,
        name: 'categories.read',
      },
      {
        path: '',
        components: {
          hero: CategoriesHeader,
          default: CategoryBrowse
        },
        name: 'categories.browse',
      },
    ]
  },
];
