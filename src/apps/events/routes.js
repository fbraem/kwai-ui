import App from './App';

const EventBrowse = () => import(/* webpackChunkName: "trainings_chunk" */
  '@/apps/events/EventBrowse'
);
const EventRead = () => import(/* webpackChunkName: "trainings_chunk" */
  '@/apps/events/EventRead'
);

let html = {};
const importAllHtml = requireContext => requireContext.keys().forEach(key => html[key] = requireContext(key));
importAllHtml(require.context('custom/events', false, /.html$/));

let icons = {};
const importAllSvg = requireContext => requireContext.keys().forEach(
  key => icons[key.split('/')[1]] = requireContext(key).default
);
importAllSvg(require.context('custom', true, /icon.svg$/));

export default [
  {
    path: '/events',
    component: App,
    children: [
      {
        path: '/events/:year(\\d+)/:month(\\d+)',
        components: {
          default: EventBrowse
        },
        name: 'events.browse',
        props: {
          default: (route) => {
            var result = {};
            if (route.params.year) result.year = Number(route.params.year);
            if (route.params.month) result.month = Number(route.params.month);
            return result;
          }
        }
      },
      {
        path: '/events/:id(\\d+)',
        components: {
          default: EventRead
        },
        name: 'events.read'
      },
      {
        path: '',
        components: {
          default: EventBrowse
        },
        name: 'events',
        meta: {
          html,
          icons
        }
      },
    ]
  },
];
