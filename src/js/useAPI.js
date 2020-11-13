import { ref } from '@vue/composition-api';

export function useAPI(callback = () => {}) {
  let data = ref();
  const error = ref();
  const isRunning = ref(false);

  const run = async(...params) => {
    try {
      error.value = null;
      isRunning.value = true;
      data = await callback(...params);
    } catch (e) {
      if (e.status && e.response) {
        error.value = e;
      } else {
        throw e;
      }
    } finally {
      isRunning.value = false;
    }
  };

  return { data, error, isRunning, run };
}
