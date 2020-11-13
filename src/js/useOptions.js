/**
 * Create an options object for VueFormulate
 * @param list
 * @param cb
 * @param extras
 * @returns {{[p: string]: *}}
 */
import {isRef} from '@vue/composition-api';

export function useOptions(list, cb, extras = {}) {
  const models = isRef(list) ? list.value : list ?? [];
  const options = models.reduce(
    (result, model) => {
      result[model.id] = cb(model);
      return result;
    },
    {}
  );
  return {
    ...options, ...extras
  };
}
