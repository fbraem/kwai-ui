import App from './App.vue';

const SeasonRead = () => import(
  /* webpackChunkName: "seasons_chunk" */
  '@/apps/seasons/SeasonRead.vue'
);
const SeasonForm = () => import(
  /* webpackChunkName: "seasons_chunk" */
  '@/apps/seasons/SeasonForm.vue'
);
const SeasonTeams = () => import(
  /* webpackChunkName: "seasons_chunk" */
  '@/apps/seasons/SeasonTeams.vue'
);
const SeasonDefinitions = () => import(
  /* webpackChunkName: "seasons_chunk" */
  '@/apps/seasons/NotImplemented.vue'
);
const SeasonTrainings = () => import(
  /* webpackChunkName: "seasons_chunk" */
  '@/apps/seasons/NotImplemented.vue'
);
const SeasonDetail = () => import(
  /* webpackChunkName: "seasons_chunk" */
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
            name: 'seasons.teams',
            meta: {
              auth: {
                action: 'read',
                subject: 'seasons'
              }
            },
          },
          {
            path: 'definitions',
            components: {
              season_information: SeasonDefinitions
            },
            name: 'seasons.definitions',
            meta: {
              auth: {
                action: 'read',
                subject: 'seasons'
              }
            },
          },
          {
            path: 'trainings',
            components: {
              season_information: SeasonTrainings
            },
            name: 'seasons.trainings',
            meta: {
              auth: {
                action: 'read',
                subject: 'seasons'
              }
            },
          },
          {
            path: '',
            components: {
              season_information: SeasonDetail
            },
            name: 'seasons.read',
            meta: {
              auth: {
                action: 'read',
                subject: 'seasons'
              }
            },
          },
        ]
      },
      {
        path: 'create',
        component: SeasonForm,
        name: 'seasons.create',
        meta: {
          auth: {
            action: 'create',
            subject: 'seasons'
          }
        },
      },
      {
        path: 'update/:id(\\d+)',
        component: SeasonForm,
        name: 'seasons.update',
        meta: {
          auth: {
            action: 'update',
            subject: 'seasons'
          }
        },
      },
      {
        path: '',
        component: SeasonBrowse,
        name: 'seasons.browse',
        meta: {
          auth: {
            action: 'read',
            subject: 'seasons'
          }
        },
      },
    ]
  },
];
