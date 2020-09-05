import App from '../App.vue';

const DefinitionBrowse = () =>
  import(/* webpackChunkName: "trainings_admin_chunk" */
    '@/apps/trainings/DefinitionBrowse.vue');

const DefinitionForm = () =>
  import(/* webpackChunkName: "trainings_admin_chunk" */
    '@/apps/trainings/DefinitionForm.vue');

const DefinitionRead = () =>
  import(/* webpackChunkName: "trainings_admin_chunk" */
    '@/apps/trainings/DefinitionRead.vue');

export default [
  {
    path: '/trainings/definitions',
    component: App,
    children: [
      {
        path: ':id(\\d+)',
        component: DefinitionRead,
        props: true,
        name: 'trainings.definitions.read',
      },
      {
        path: 'create',
        component: DefinitionForm,
        props: true,
        name: 'trainings.definitions.create',
      },
      {
        path: 'update/:id(\\d+)',
        component: DefinitionForm,
        props: true,
        name: 'trainings.definitions.update',
      },
      {
        path: '',
        component: DefinitionBrowse,
        name: 'trainings.definitions.browse',
      },
    ]
  },
];
