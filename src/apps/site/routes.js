import App from './App';
import Header from './Header';
import HomeApp from './Home';

let html = {};
const importAll = requireContext => requireContext.keys().forEach(key => html[key] = requireContext(key));
importAll(require.context('custom/site', false, /.html$/));

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
        },
        meta: {
          html
        }
      },
    ]
  },
];
