import App from '../App.vue';

import moment from 'moment';

const CoachBrowse = () =>
  import(/* webpackChunkName: "trainings_admin_chunk" */
    '@/apps/trainings/CoachBrowse.vue'
  );

const CoachRead = () =>
  import(/* webpackChunkName: "trainings_admin_chunk" */
    '@/apps/trainings/CoachRead.vue'
  );

const CoachTrainings = () =>
  import(/* webpackChunkName: "trainings_admin_chunk" */
    '@/apps/trainings/CoachTrainings.vue'
  );

const CoachForm = () =>
  import(/* webpackChunkName: "trainings_admin_chunk" */
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
            }
          },
          {
            path: 'trainings',
            name: 'trainings.coaches.trainings.default',
            component: CoachTrainings,
            props: (route) => {
              return {
                year: moment().year(),
                month: moment().month() + 1
              };
            }
          },
          {
            path: '',
            redirect: {
              name: 'trainings.coaches.trainings.default'
            },
            name: 'trainings.coaches.read'
          },
        ]
      },
      {
        path: 'create',
        component: CoachForm,
        name: 'trainings.coaches.create',
      },
      {
        path: 'update/:id(\\d+)',
        component: CoachForm,
        props: true,
        name: 'trainings.coaches.update',
      },
      {
        path: '',
        name: 'trainings.coaches',
        component: CoachBrowse
      },
    ]
  },
];
