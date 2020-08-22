import { ref } from '@vue/composition-api';

export function useAPI(callback = () => {}) {
  let data = ref();
  const error = ref();
  const isRunning = ref(false);

  const run = async(...params) => {
    try {
      isRunning.value = true;
      data = await callback(...params);
    } catch (e) {
      error.value = e;
    } finally {
      isRunning.value = false;
    }
  };

  return { data, error, isRunning, run };
}
