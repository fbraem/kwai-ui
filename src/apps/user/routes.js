import App from './App.vue';
import Login from './Login.vue';

export default [
  {
    path: '/user',
    component: App,
    children: [
      {
        path: 'login',
        name: 'user.login',
        components: {
          default: Login
        }
      },
    ]
  },
];
