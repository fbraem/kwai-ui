import App from '@/apps/users/App.vue';

import abilitiesRouter from './abilities';

const UserRead = () => import(
  /* webpackChunkName: "user_chunk" */
  '@/apps/users/UserRead.vue'
);
const UserHeader = () => import(
  /* webpackChunkName: "user_chunk" */
  '@/apps/users/TheUserHeader.vue'
);
const UsersHeader = () => import(
  /* webpackChunkName: "user_chunk" */
  '@/apps/users/TheUsersHeader.vue'
);
const UserBrowse = () => import(
  /* webpackChunkName: "user_chunk" */
  '@/apps/users/UserBrowse.vue'
);

const UserInviteHeader = () => import(
  '@/apps/users/TheUserInviteHeader.vue'
);

const UserInvite = () => import(
  /* webpackChunkName: "user_admin" */
  '@/apps/users/UserInvite.vue'
);

const UserRegisterWithInviteHeader = () => import(
  /* webpackChunkName: "user_chunk" */
  '@/apps/users/TheUserRegisterWithInviteHeader.vue'
);
const UserRegisterWithInvite = () => import(
  /* webpackChunkName: "user_admin" */
  '@/apps/users/UserRegisterWithInvite.vue'
);

const routes = [
  {
    path: '/users',
    component: App,
    children: [
      {
        path: 'invitation',
        components: {
          hero: UserInviteHeader,
          default: UserInvite
        },
        props: {
          hero: true,
          default: true
        },
        name: 'users.invitation',
        meta: {
          auth: {
            action: 'manage',
            subject: 'users'
          }
        }
      },
      {
        path: 'invitation/:token',
        components: {
          hero: UserRegisterWithInviteHeader,
          default: UserRegisterWithInvite
        },
        props: {
          hero: true,
          default: true
        },
        name: 'users.invitation.confirm',
      },
      ...abilitiesRouter,
      {
        path: ':id',
        components: {
          hero: UserHeader,
          default: UserRead
        },
        props: {
          hero: true,
          default: true
        },
        name: 'users.read',
        meta: {
          auth: {
            action: 'manage',
            subject: 'users'
          }
        }
      },
      {
        path: '',
        components: {
          hero: UsersHeader,
          default: UserBrowse
        },
        name: 'users.browse',
        meta: {
          auth: {
            action: 'manage',
            subject: 'users'
          }
        }
      },
    ]
  },
];

export default routes;
