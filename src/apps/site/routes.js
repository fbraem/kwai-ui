import App from './App';
import Header from './Header';
import HomeApp from './Home';

let html = {};
const importAllHtml = requireContext => requireContext.keys().forEach(key => html[key] = requireContext(key));
importAllHtml(require.context('custom/site', false, /.html$/));

let icons = {};
const importAllSvg = requireContext => requireContext.keys().forEach(
  key => icons[key.split('/')[1]] = requireContext(key).default
);
importAllSvg(require.context('custom', true, /icon.svg$/));

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
          html,
          icons
        }
      },
    ]
  },
];
