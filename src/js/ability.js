import { Ability } from '@casl/ability';

/**
 * Function to get the type of the model
 */
function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item;
  }
  if (typeof item === 'function') {
    return item.type();
  }
  return item.constructor.type();
}

export const ability = new Ability([], { subjectName });

// TODO: Also used in store authentication... Search for a better integration
import Lockr from 'lockr';
const USER_RULES_KEY = 'rules';

export const abilityPlugin = (store) => {
  ability.update(Lockr.get(USER_RULES_KEY, []));
  return store.subscribe((mutation, state) => {
    switch (mutation.type) {
    case 'authentication/setLogin':
      console.log('user has logged in..., get the rules');
      store.dispatch('authentication/user');
      break;
    case 'authentication/setUser':
      console.log('The user has been retrieved, update the rules');
      ability.update(state.authentication.rules);
      break;
    case 'authentication/setLogout':
      console.log('The user has been logged out, clear the rules');
      ability.update([]);
      break;
    }
  });
};
