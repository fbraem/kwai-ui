import App from './App';
import Login from './Login';

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
