import {ref, computed, inject, provide} from '@vue/composition-api';
import { http_api } from '@/js/http';
import Training from '@/models/trainings/Training';
import Transformer from '@/js/jsonapi/Transformer';
import { useAPI } from '@/js/useAPI';

const http_trainings_api = http_api.url('trainings');

/**
 * State management for Coach.
 * @return {Object}
 */
export default function createTrainingService() {
  const all = ref([]);
  const current = ref();

  /**
   * Load all trainings.
   * @param {boolean} reload
   * @returns {Array}
   */
  const load = useAPI(async({ year, month, coach } = {}, reload = false) => {
    if (!reload && all.value.length > 0) return all;

    let api = http_trainings_api;
    if (year) {
      api = api.query({ 'filter[year]': year });
      if (month) {
        api = api.query({ 'filter[month]': month });
      }
    }
    if (coach) {
      api = api.query({ 'filter[coach]': coach });
    }

    const json = await api
      .get()
      .json()
    ;
    all.value = (new Transformer()).deserialize(Training, json);
    return all;
  });

  /**
   * Read the training.
   * @param {int} id
   */
  const read = useAPI(async(id) => {
    // Don't read it again
    if (current.value?.id === id) return current;

    // See if it was already loaded
    current.value = all.value.find((c) => c.id === id);
    if (current.value) return current;

    const json = await http_trainings_api
      .url(`/${id}`)
      .get()
      .json()
    ;
    current.value = (new Transformer()).deserialize(Training, json);
    return current;
  });

  /**
   * Save the trainings
   * @param training
   */
  const save = useAPI(async(training) => {
    const transformer = new Transformer();

    let api = http_trainings_api;
    if (training.id) api = api.url(`/${training.id}`);
    api = api.json(transformer.serialize(training));

    const res = await (training.id ? api.patch() : api.post());
    current.value = transformer.deserialize(Training, await res.json());
    if (!training.id) all.value.push(current.value);

    return current;
  });

  const saveAll = useAPI(async(trainings) => {
    const transformer = new Transformer();

    const json = {
      data: trainings.map((training) => {
        return transformer.serialize(training)['data'];
      })
    };

    const res = http_trainings_api
      .json(json)
      .post()
      .json()
    ;
    return res.data;
  });

  /**
   * Clear all coaches
   */
  function reset() {
    all.value = [];
    current.value = null;
  }

  return {
    all: computed(() => all.value),
    count: computed(() => all.value.length),
    current: computed(() => current.value),
    load,
    read,
    reset,
    save,
    saveAll
  };
};

const TrainingsSymbol = Symbol();

export function useTrainingStore() {
  return inject(TrainingsSymbol);
}

export function provideTrainingStore() {
  provide(TrainingsSymbol, createTrainingService());
}
