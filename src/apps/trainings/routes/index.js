import App from '../App.vue';

import moment from 'moment';

import definitionsRouter from './definitions';
import coachesRouter from './coaches';

const TrainingHeader = () =>
  import(/* webpackChunkName: "trainings_chunk" */
    '@/apps/trainings/TheTrainingHeader.vue'
  );
const TrainingRead = () =>
  import(/* webpackChunkName: "trainings_chunk" */
    '@/apps/trainings/TrainingRead.vue'
  );
const TrainingsHeader = () =>
  import(/* webpackChunkName: "trainings_chunk" */
    '@/apps/trainings/TheTrainingsHeader.vue'
  );
const TrainingBrowse = () =>
  import(/* webpackChunkName: "trainings_chunk" */
    '@/apps/trainings/TrainingBrowse.vue'
  );
const TrainingIndex = () =>
  import(/* webpackChunkName: "trainings_chunk" */
    '@/apps/trainings/Index.vue'
  );
const TrainingForm = () =>
  import(/* webpackChunkName: "trainings_admin_chunk" */
    '@/apps/trainings/TrainingForm.vue'
  );
const Presences = () =>
  import(/* webpackChunkName: "trainings_chunk" */
    '@/apps/trainings/Presences.vue'
  );

let routes = [
  {
    path: '/trainings',
    component: App,
    children: [
      {
        path: ':id(\\d+)',
        component: TrainingRead,
        props: true,
        name: 'trainings.read',
      },
      {
        path: ':id(\\d+)/presences',
        component: Presences,
        props: true,
        name: 'trainings.presences',
        meta: {
          auth: {
            action: 'read',
            subject: 'presences'
          }
        },
      },
      {
        path: ':year(\\d+)/:month(\\d+)',
        components: {
          hero: TrainingsHeader,
          default: TrainingBrowse
        },
        name: 'trainings.browse',
        props: {
          default: (route) => {
            const year = route.params.year
              ? Number(route.params.year) : moment().year();
            const month = route.params.month
              ? Number(route.params.month) : moment().month() + 1;
            return { year, month };
          }
        }
      },
      {
        path: 'create',
        component: TrainingForm,
        name: 'trainings.create',
        meta: {
          auth: {
            action: 'create',
            subject: 'trainings'
          }
        },
      },
      {
        path: 'update/:id(\\d+)',
        component: TrainingForm,
        props: true,
        name: 'trainings.update',
        meta: {
          auth: {
            action: 'update',
            subject: 'trainings'
          }
        },
      },
      {
        path: '',
        components: {
          hero: TrainingsHeader,
          default: TrainingIndex
        },
        name: 'trainings'
      },
    ]
  },
];

routes = routes
  .concat(definitionsRouter)
  .concat(coachesRouter);

export default routes;
