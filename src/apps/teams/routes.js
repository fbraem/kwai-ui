import App from './App.vue';

const TeamRead = () => import(
  /* webpackChunkName: "teams_chunk" */
  './TeamRead.vue'
);
const TeamDetails = () => import(
  /* webpackChunkName: "teams_chunk" */
  './TeamDetails.vue'
);
const TeamTrainings = () => import(
  /* webpackChunkName: "teams_chunk" */
  './NotImplemented.vue'
);
const TeamMembers = () => import(
  /* webpackChunkName: "teams_chunk" */
  './TeamMembers.vue'
);
const AddMembers = () => import(
  /* webpackChunkName: "teams_chunk" */
  './AddMembers.vue'
);
const TeamTournaments = () => import(
  /* webpackChunkName: "teams_chunk" */
  './NotImplemented.vue'
);
const TeamBrowse = () => import(
  /* webpackChunkName: "teams_chunk" */
  './TeamBrowse.vue'
);
const TeamForm = () => import(
  /* webpackChunkName: "teams_chunk" */
  './TeamForm.vue'
);

const TeamCategoryRead = () => import(
  /* webpackChunkName: "teams_chunk" */
  './TeamCategoryRead.vue'
);
const TeamCategoryBrowse = () => import(
  /* webpackChunkName: "teams_chunk" */
  './TeamCategoryBrowse.vue'
);
const TeamCategoryForm = () => import(
  /* webpackChunkName: "teams_chunk" */
  './TeamCategoryForm.vue'
);

export default [
  {
    path: '/teams',
    component: App,
    children: [
      {
        path: ':id(\\d+)',
        component: TeamRead,
        props: true,
        children: [
          {
            path: 'members',
            components: {
              team_information: TeamMembers
            },
            name: 'team.members',
            meta: {
              auth: {
                action: 'read',
                subject: 'teams'
              }
            },
          },
          {
            path: 'season',
            components: {
              team_information: TeamTournaments
            },
            name: 'team.tournaments',
            meta: {
              auth: {
                action: 'read',
                subject: 'teams'
              }
            },
          },
          {
            path: 'trainings',
            components: {
              team_information: TeamTrainings
            },
            name: 'team.trainings',
            meta: {
              auth: {
                action: 'read',
                subject: 'teams'
              }
            },
          },
          {
            path: 'add_members',
            components: {
              team_information: AddMembers
            },
            props: {
              team_information: true
            },
            name: 'team.add_members',
            meta: {
              auth: {
                action: 'manage',
                subject: 'teams'
              }
            },
          },
          {
            path: '',
            components: {
              team_information: TeamDetails
            },
            name: 'teams.read',
          },
        ]
      },
      {
        path: 'create',
        component: TeamForm,
        name: 'teams.create',
        meta: {
          auth: {
            action: 'create',
            subject: 'teams'
          }
        },
      },
      {
        path: 'update/:id(\\d+)',
        component: TeamForm,
        props: true,
        name: 'teams.update',
        meta: {
          auth: {
            action: 'update',
            subject: 'teams'
          }
        },
      },
      {
        path: 'categories/:id(\\d+)',
        props: true,
        component: TeamCategoryRead,
        name: 'team_categories.read',
        meta: {
          auth: {
            action: 'manage',
            subject: 'teams'
          }
        },
      },
      {
        path: 'categories/create',
        component: TeamCategoryForm,
        name: 'team_categories.create',
        meta: {
          auth: {
            action: 'manage',
            subject: 'teams'
          }
        },
      },
      {
        path: 'categories/update/:id(\\d+)',
        component: TeamCategoryForm,
        props: true,
        name: 'team_categories.update',
        meta: {
          auth: {
            action: 'manage',
            subject: 'teams'
          }
        },
      },
      {
        path: 'categories',
        component: TeamCategoryBrowse,
        name: 'team_categories.browse',
        meta: {
          auth: {
            action: 'manage',
            subject: 'teams'
          }
        },
      },
      {
        path: '',
        component: TeamBrowse,
        name: 'teams.browse',
        meta: {
          auth: {
            action: 'read',
            subject: 'teams'
          }
        },
      },
    ]
  },
];
