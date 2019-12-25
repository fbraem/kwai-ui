import { actions } from './actions';
import { mutations } from './mutations';

import makeModelStore from '@/js/makeModelStore';
import User from '@/models/users/User';

export default makeModelStore({
  model: User,
  mutations,
  actions
});
