import App from './App.vue';
import Header from './Header.vue';
import HomeApp from './Home.vue';

let html = {};
const importAllHtml = requireContext => requireContext.keys().forEach(
  key => { html[key] = requireContext(key); }
);
importAllHtml(require.context('custom/portal', false, /.html$/));

let icons = {};
const importAllSvg = requireContext => requireContext.keys().forEach(
  key => { icons[key.split('/')[1]] = requireContext(key).default; }
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
