import Site from './Site';

let routes = {
  path: '/',
  component: Site
};

import makeRoutes from '@/apps/routes';
routes.children = makeRoutes();

export default [
  routes,
];
