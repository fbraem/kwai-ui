import App from '@/apps/users/App.vue';

const UserAbilitiesHeader = () =>
  import(
    /* webpackChunkName: "abilities_chunk" */
    '@/apps/users/TheUserAbilitiesHeader.vue');
const UserAbilities = () =>
  import(
    /* webpackChunkName: "abilities_chunk" */
    '@/apps/users/UserAbilities.vue');

const AbilitiesHeader = () =>
  import(
    /* webpackChunkName: "abilities_chunk" */
    '@/apps/users/TheAbilitiesHeader.vue');
const AbilityBrowse = () =>
  import(
    /* webpackChunkName: "abilities_chunk" */
    '@/apps/users/AbilityBrowse.vue');

const AbilityHeader = () =>
  import(
    /* webpackChunkName: "abilities_chunk" */
    '@/apps/users/TheAbilityHeader.vue');
const AbilityRead = () =>
  import(
    /* webpackChunkName: "abilities_chunk" */
    '@/apps/users/AbilityRead.vue');

const AbilityFormHeader = () =>
  import(
    /* webpackChunkName: "abilities_chunk" */
    '@/apps/users/TheAbilityFormHeader.vue');
const AbilityForm = () =>
  import(
    /* webpackChunkName: "abilities_chunk" */
    '@/apps/users/AbilityForm.vue');

export default [
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
        props: {
          hero: true,
          default: true
        },
        name: 'users.abilities.read',
        meta: {
          auth: {
            action: 'manage',
            subject: 'rules'
          }
        }
      },
      {
        path: 'create',
        components: {
          hero: AbilityFormHeader,
          default: AbilityForm
        },
        props: {
          hero: true,
          default: true
        },
        name: 'users.abilities.create',
        meta: {
          auth: {
            action: 'manage',
            subject: 'rules'
          }
        }
      },
      {
        path: 'update/:id(\\d+)',
        components: {
          hero: AbilityFormHeader,
          default: AbilityForm
        },
        props: {
          hero: true,
          default: true
        },
        name: 'users.abilities.update',
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
          hero: AbilitiesHeader,
          default: AbilityBrowse
        },
        name: 'users.abilities.browse',
        meta: {
          auth: {
            action: 'manage',
            subject: 'users'
          }
        }
      },
    ]
  },
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
        props: {
          hero: true,
          default: true
        },
        name: 'users.abilities',
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
