import App from './App';
import Header from './Header';
import HomeApp from './Home';

export default [
  {
    path: '',
    component: App,
    children: [
      {
        path: '',
        name: 'home',
        components: {
          hero: Header,
          default: HomeApp
        }
      },
    ]
  },
];
