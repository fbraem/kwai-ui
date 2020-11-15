import App from './App.vue';

let html = {};
const importAllHtml = requireContext => requireContext.keys().forEach(
  key => { html[key] = requireContext(key); }
);
importAllHtml(require.context('custom/events', false, /.html$/));

let icons = {};
const importAllSvg = requireContext => requireContext.keys().forEach(
  key => { icons[key.split('/')[1]] = requireContext(key).default; }
);
importAllSvg(require.context('custom', true, /icon.svg$/));

export default [
  {
    path: '/events',
    component: App,
    name: 'events',
    meta: {
      html,
      icons
    }
  },
];
