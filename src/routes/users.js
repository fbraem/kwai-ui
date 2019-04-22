import App from '@/site/App.vue';

const UserRead = () => import(
  /* webpackChunkName: "user_chunck" */
  '@/apps/users/UserRead.vue'
);
const UserHeader = () => import(
  /* webpackChunkName: "user_chunck" */
  '@/apps/users/TheUserHeader.vue'
);
const UsersHeader = () => import(
  /* webpackChunkName: "user_chunck" */
  '@/apps/users/TheUsersHeader.vue'
);
const UserBrowse = () => import(
  /* webpackChunkName: "user_chunck" */
  '@/apps/users/UserBrowse.vue'
);

const UserInviteHeader = () => import(
  /* webpackChunkName: "user_chunck" */
  '@/apps/users/TheUserInviteHeader.vue'
);

const UserInvite = () => import(
  /* webpackChunkName: "user_admin" */
  '@/apps/users/UserInvite.vue'
);

const UserRegisterWithInviteHeader = () => import(
  /* webpackChunkName: "user_chunck" */
  '@/apps/users/TheUserRegisterWithInviteHeader.vue'
);
const UserRegisterWithInvite = () => import(
  /* webpackChunkName: "user_admin" */
  '@/apps/users/UserRegisterWithInvite.vue'
);

import UserStore from '@/stores/users';
import NewsStore from '@/stores/news';
import PageStore from '@/stores/pages';

import makeStore from '@/js/makeVuex';
var store = makeStore();

export default [
  {
    path: '/users',
    beforeEnter(to, from, next) {
      store.setModule(['user'], UserStore);
      next();
    },
    component: App,
    children: [
      {
        path: 'invite',
        components: {
          header: UserInviteHeader,
          main: UserInvite
        },
        name: 'users.invite',
      },
      {
        path: 'invite/:token',
        components: {
          header: UserRegisterWithInviteHeader,
          main: UserRegisterWithInvite
        },
        name: 'users.register.invite',
      },
      {
        path: ':id',
        beforeEnter(to, from, next) {
          store.setModule(['news'], NewsStore);
          store.setModule(['page'], PageStore);
          next();
        },
        components: {
          header: UserHeader,
          main: UserRead
        },
        name: 'users.read',
      },
      {
        path: '',
        components: {
          header: UsersHeader,
          main: UserBrowse
        },
        name: 'users.browse',
      },
    ]
  },
];
