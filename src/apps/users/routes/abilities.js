import App from '@/apps/users/App.vue';

const UserAbilitiesHeader = () =>
  import(/* webpackChunkName: "user_admin_chunck" */
    '@/apps/users/TheUserAbilitiesHeader.vue');
const UserAbilities = () =>
  import(/* webpackChunkName: "user_admin_chunck" */
    '@/apps/users/UserAbilities.vue');

const AbilitiesHeader = () =>
  import(/* webpackChunkName: "user_admin_chunck" */
    '@/apps/users/TheAbilitiesHeader.vue');
const AbilityBrowse = () =>
  import(/* webpackChunkName: "user_admin_chunck" */
    '@/apps/users/AbilityBrowse.vue');

const AbilityHeader = () =>
  import(/* webpackChunkName: "user_admin_chunck" */
    '@/apps/users/TheAbilityHeader.vue');
const AbilityRead = () =>
  import(/* webpackChunkName: "user_admin_chunck" */
    '@/apps/users/AbilityRead.vue');

const AbilityFormHeader = () =>
  import(/* webpackChunkName: "user_admin_chunck" */
    '@/apps/users/TheAbilityFormHeader.vue');
const AbilityForm = () =>
  import(/* webpackChunkName: "user_admin_chunck" */
    '@/apps/users/AbilityForm.vue');

export default [
  {
    path: '/users/:id/abilities',
    component: App,
    children: [
      {
        path: '',
        components: {
          hero: UserAbilitiesHeader,
          default: UserAbilities
        },
        name: 'users.abilities',
      },
    ]
  },
  {
    path: '/users/abilities',
    component: App,
    children: [
      {
        path: ':id(\\d+)',
        components: {
          hero: AbilityHeader,
          default: AbilityRead
        },
        name: 'users.abilities.read'
      },
      {
        path: 'create',
        components: {
          hero: AbilityFormHeader,
          default: AbilityForm
        },
        props: {
          hero: {
            creating: true
          }
        },
        name: 'users.abilities.create'
      },
      {
        path: 'update/:id(\\d+)',
        components: {
          hero: AbilityFormHeader,
          default: AbilityForm
        },
        props: {
          hero: {
            creating: false
          }
        },
        name: 'users.abilities.update'
      },
      {
        path: '',
        components: {
          hero: AbilitiesHeader,
          default: AbilityBrowse
        },
        name: 'users.abilities.browse',
      },
    ]
  },
];