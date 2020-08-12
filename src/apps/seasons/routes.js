import App from './App.vue';

const SeasonRead = () => import(
  /* webpackChunkName: "seasons_chunk" */
  '@/apps/seasons/SeasonRead.vue'
);
const SeasonForm = () => import(
  /* webpackChunkName: "seasons_admin" */
  '@/apps/seasons/SeasonForm.vue'
);
const SeasonTeams = () => import(
  /* webpackChunkName: "seasons_admin" */
  '@/apps/seasons/SeasonTeams.vue'
);
const SeasonDefinitions = () => import(
  /* webpackChunkName: "seasons_admin" */
  '@/apps/seasons/NotImplemented.vue'
);
const SeasonTrainings = () => import(
  /* webpackChunkName: "seasons_admin" */
  '@/apps/seasons/NotImplemented.vue'
);
const SeasonDetail = () => import(
  /* webpackChunkName: "seasons_admin" */
  '@/apps/seasons/SeasonDetail.vue'
);
const SeasonBrowse = () => import(
  /* webpackChunkName: "seasons_chunk" */
  '@/apps/seasons/SeasonBrowse.vue'
);

export default [
  {
    path: '/seasons',
    component: App,
    children: [
      {
        path: ':id(\\d+)',
        component: SeasonRead,
        children: [
          {
            path: 'teams',
            components: {
              season_information: SeasonTeams
            },
            name: 'seasons.teams'
          },
          {
            path: 'definitions',
            components: {
              season_information: SeasonDefinitions
            },
            name: 'seasons.definitions'
          },
          {
            path: 'trainings',
            components: {
              season_information: SeasonTrainings
            },
            name: 'seasons.trainings'
          },
          {
            path: '',
            components: {
              season_information: SeasonDetail
            },
            name: 'seasons.read',
          },
        ]
      },
      {
        path: 'create',
        component: SeasonForm,
        name: 'seasons.create',
      },
      {
        path: 'update/:id(\\d+)',
        component: SeasonForm,
        name: 'seasons.update',
      },
      {
        path: '',
        component: SeasonBrowse,
        name: 'seasons.browse',
      },
    ]
  },
];
