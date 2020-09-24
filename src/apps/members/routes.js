import App from './App';

const MemberRead = () => import(
  /* webpackChunkName: "member_admin" */
  '@/apps/members/MemberRead.vue'
);
const MemberDetail = () => import(
  /* webpackChunkName: "member_admin" */
  '@/apps/members/MemberDetail.vue'
);
const NotImplemented = () => import(
  /* webpackChunkName: "member_admin" */
  '@/apps/members/NotImplemented.vue'
);
const MemberTeams = () => import(
  /* webpackChunkName: "member_admin" */
  '@/apps/members/MemberTeams.vue'
);
const MemberUpload = () => import(
  /* webpackChunkName: "member_admin" */
  '@/apps/members/MemberUpload.vue'
);
const MemberBrowse = () => import(
  /* webpackChunkName: "member_admin" */
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
            name: 'members.teams'
          },
          {
            path: 'trainings',
            components: {
              member_information: NotImplemented,
            },
            name: 'members.trainings',
          },
          {
            path: 'tournaments',
            components: {
              member_information: NotImplemented,
            },
            name: 'members.tournaments',
          },
          {
            path: '',
            components: {
              member_information: MemberDetail,
            },
            name: 'members.read',
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
