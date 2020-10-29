import { Ability } from '@casl/ability';
import { isRef, unref} from '@vue/composition-api';
import Lockr from 'lockr';

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
  if (isRef(item)) {
    const realObject = unref(item);
    if (realObject) return realObject.constructor.type();
    return null;
  }
  return item.constructor.type();
}

// TODO: Move Lockr related things to a separate class
export const ability = new Ability(
  Lockr.get('rules', []), { subjectName }
);
