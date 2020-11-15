import App from './App.vue';

const MemberRead = () => import(
  /* webpackChunkName: "members_chunk" */
  '@/apps/members/MemberRead.vue'
);
const MemberDetail = () => import(
  /* webpackChunkName: "members_chunk" */
  '@/apps/members/MemberDetail.vue'
);
const NotImplemented = () => import(
  /* webpackChunkName: "members_chunk" */
  '@/apps/members/NotImplemented.vue'
);
const MemberTeams = () => import(
  /* webpackChunkName: "members_chunk" */
  '@/apps/members/MemberTeams.vue'
);
const MemberUpload = () => import(
  /* webpackChunkName: "members_chunk" */
  '@/apps/members/MemberUpload.vue'
);
const MemberBrowse = () => import(
  /* webpackChunkName: "members_chunk" */
  '@/apps/members/MemberBrowse.vue'
);

export default [
  {
    path: '/members',
    component: App,
    children: [
      {
        path: ':id(\\d+)',
        component: MemberRead,
        props: true,
        children: [
          {
            path: 'teams',
            components: {
              member_information: MemberTeams
            },
            name: 'members.teams',
            meta: {
              auth: {
                action: 'manage',
                subject: 'members'
              }
            },
          },
          {
            path: 'trainings',
            components: {
              member_information: NotImplemented,
            },
            name: 'members.trainings',
            meta: {
              auth: {
                action: 'manage',
                subject: 'members'
              }
            },
          },
          {
            path: 'tournaments',
            components: {
              member_information: NotImplemented,
            },
            name: 'members.tournaments',
            meta: {
              auth: {
                action: 'manage',
                subject: 'members'
              }
            },
          },
          {
            path: '',
            components: {
              member_information: MemberDetail,
            },
            name: 'members.read',
            meta: {
              auth: {
                action: 'manage',
                subject: 'members'
              }
            },
          },
        ]
      },
      {
        path: 'upload',
        component: MemberUpload,
        name: 'members.upload',
      },
      {
        path: '',
        component: MemberBrowse,
        name: 'members.browse',
      },
    ]
  },
];
