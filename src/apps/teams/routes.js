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
const TeamTournaments = () => import(
  /* webpackChunkName: "teams_chunk" */
  './NotImplemented.vue'
);
const TeamBrowse = () => import(
  /* webpackChunkName: "teams_chunk" */
  './TeamBrowse.vue'
);
const TeamForm = () => import(
  /* webpackChunkName: "teams_admin_chunk" */
  './TeamForm.vue'
);

const TeamCategoryRead = () => import(
  /* webpackChunkName: "teams_admin_chunk" */
  './TeamCategoryRead.vue'
);
const TeamCategoryBrowse = () => import(
  /* webpackChunkName: "teams_admin_chunk" */
  './TeamCategoryBrowse.vue'
);
const TeamCategoryForm = () => import(
  /* webpackChunkName: "teams_admin_chunk" */
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
            name: 'team.members'
          },
          {
            path: 'season',
            components: {
              team_information: TeamTournaments
            },
            name: 'team.tournaments'
          },
          {
            path: 'trainings',
            components: {
              team_information: TeamTrainings
            },
            name: 'team.trainings'
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
      },
      {
        path: 'update/:id(\\d+)',
        component: TeamForm,
        props: true,
        name: 'teams.update',
      },
      {
        path: 'categories/:id(\\d+)',
        props: true,
        component: TeamCategoryRead,
        name: 'team_categories.read',
      },
      {
        path: 'categories/create',
        component: TeamCategoryForm,
        name: 'team_categories.create',
      },
      {
        path: 'categories/update/:id(\\d+)',
        component: TeamCategoryForm,
        props: true,
        name: 'team_categories.update',
      },
      {
        path: 'categories',
        component: TeamCategoryBrowse,
        name: 'team_categories.browse',
      },
      {
        path: '',
        component: TeamBrowse,
        name: 'teams.browse',
      },
    ]
  },
];
