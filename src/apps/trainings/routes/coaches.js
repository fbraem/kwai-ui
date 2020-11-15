import App from '../App.vue';

import moment from 'moment';

const CoachBrowse = () =>
  import(
    /* webpackChunkName: "coaches_chunk" */
    '@/apps/trainings/CoachBrowse.vue'
  );

const CoachRead = () =>
  import(
    /* webpackChunkName: "coaches_chunk" */
    '@/apps/trainings/CoachRead.vue'
  );

const CoachTrainings = () =>
  import(
    /* webpackChunkName: "coaches_chunk" */
    '@/apps/trainings/CoachTrainings.vue'
  );

const CoachForm = () =>
  import(
    /* webpackChunkName: "coaches_chunk" */
    '@/apps/trainings/CoachForm.vue'
  );

export default [
  {
    path: '/trainings/coaches',
    component: App,
    children: [
      {
        path: ':id(\\d+)',
        component: CoachRead,
        props: true,
        children: [
          {
            path: 'trainings/:year(\\d+)/:month(\\d+)',
            name: 'trainings.coaches.trainings',
            component: CoachTrainings,
            props: (route) => {
              return {
                year: Number(route.params.year),
                month: Number(route.params.month)
              };
            },
            meta: {
              auth: {
                action: 'read',
                subject: 'coaches'
              }
            },
          },
          {
            path: 'trainings',
            name: 'trainings.coaches.trainings.default',
            component: CoachTrainings,
            props: () => {
              return {
                year: moment().year(),
                month: moment().month() + 1
              };
            },
            meta: {
              auth: {
                action: 'read',
                subject: 'coaches'
              }
            },
          },
          {
            path: '',
            redirect: {
              name: 'trainings.coaches.trainings.default'
            },
            name: 'trainings.coaches.read',
            meta: {
              auth: {
                action: 'read',
                subject: 'coaches'
              }
            },
          },
        ]
      },
      {
        path: 'create',
        component: CoachForm,
        name: 'trainings.coaches.create',
        meta: {
          auth: {
            action: 'create',
            subject: 'coaches'
          }
        },
      },
      {
        path: 'update/:id(\\d+)',
        component: CoachForm,
        props: true,
        name: 'trainings.coaches.update',
        meta: {
          auth: {
            action: 'update',
            subject: 'coaches'
          }
        },
      },
      {
        path: '',
        name: 'trainings.coaches',
        component: CoachBrowse,
        meta: {
          auth: {
            action: 'read',
            subject: 'coaches'
          }
        },
      },
    ]
  },
];
