export default [
  {
    path: '/club',
    name: 'club',
    redirect: {
      name: 'categories.read.app',
      params: {
        app: 'club'
      }
    }
  },
];
