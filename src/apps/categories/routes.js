import App from './App.vue';

const CategoryRead = () => import(
  /* webpackChunkName: "category_chunck" */
  '@/apps/categories/CategoryRead.vue'
);
const CategoryFormHeader = () => import(
  /* webpackChunkName: "category_admin_chunck" */
  '@/apps/categories/TheCategoryFormHeader.vue'
);
const CategoryForm = () => import(
  /* webpackChunkName: "category_admin_chunck" */
  '@/apps/categories/CategoryForm.vue'
);
const CategoriesHeader = () => import(
  /* webpackChunkName: "category_chunck" */
  '@/apps/categories/TheCategoriesHeader.vue'
);
const CategoryBrowse = () => import(
  /* webpackChunkName: "category_chunck" */
  '@/apps/categories/CategoryBrowse.vue'
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
        path: 'create',
        components: {
          hero: CategoryFormHeader,
          default: CategoryForm
        },
        props: {
          hero: {
            creating: true
          }
        },
        name: 'categories.create',
        meta: {
          auth: {
            action: 'create',
            subject: 'application'
          }
        }
      },
      {
        path: 'update/:id(\\d+)',
        components: {
          hero: CategoryFormHeader,
          default: CategoryForm
        },
        props: {
          hero: {
            creating: false
          }
        },
        name: 'categories.update',
        meta: {
          auth: {
            action: 'update',
            subject: 'application'
          }
        }
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
