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
        meta: {
          auth: {
            action: 'manage',
            subject: 'trainings'
          }
        },
      },
      {
        path: 'create',
        component: DefinitionForm,
        props: true,
        name: 'trainings.definitions.create',
        meta: {
          auth: {
            action: 'manage',
            subject: 'trainings'
          }
        },
      },
      {
        path: 'update/:id(\\d+)',
        component: DefinitionForm,
        props: true,
        name: 'trainings.definitions.update',
        meta: {
          auth: {
            action: 'manage',
            subject: 'trainings'
          }
        },
      },
      {
        path: '',
        component: DefinitionBrowse,
        name: 'trainings.definitions.browse',
        meta: {
          auth: {
            action: 'manage',
            subject: 'trainings'
          }
        },
      },
    ]
  },
];
