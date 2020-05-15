import Site from './Site';
import Toolbar from './Toolbar';
import Footer from './Footer';

let routes = {
  path: '/',
  components: {
    toolbar: Toolbar,
    default: Site,
    footer: Footer
  },
};

import makeRoutes from '@/apps/routes';
routes.children = makeRoutes();

export default [
  routes,
];
