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
const TrainingFormHeader = () =>
  import(/* webpackChunkName: "trainings_admin_chunk" */
    '@/apps/trainings/TheTrainingFormHeader.vue'
  );
const Presences = () =>
  import(/* webpackChunkName: "trainings_chunk" */
    '@/apps/trainings/Presences.vue'
  );
const ThePresencesHeader = () =>
  import(/* webpackChunkName: "trainings_chunk" */
    '@/apps/trainings/ThePresencesHeader.vue'
  );

var routes = [
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
        components: {
          hero: ThePresencesHeader,
          default: Presences
        },
        name: 'trainings.presences',
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
      },
      {
        path: 'update/:id(\\d+)',
        component: TrainingForm,
        props: true,
        name: 'trainings.update',
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
