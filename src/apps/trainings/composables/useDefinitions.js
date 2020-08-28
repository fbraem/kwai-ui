import {ref, computed, inject, provide} from '@vue/composition-api';
import { http_api } from '@/js/http';
import Definition from '@/models/trainings/Definition';
import Transformer from '@/js/jsonapi/Transformer';
import { useAPI } from '@/js/useAPI';

const http_definitions_api = http_api.url('trainings/definitions');

/**
 * State management for Coach.
 * @return {Object}
 */
export default function createDefinitionService() {
  const all = ref([]);
  const current = ref();

  /**
   * Load all definitions.
   * @param {boolean} reload
   * @returns {Array}
   */
  const load = useAPI(async(reload = false) => {
    if (!reload && all.value.length > 0) return all;

    const json = await http_definitions_api
      .get()
      .json()
    ;
    all.value = (new Transformer()).deserialize(Definition, json);
    return all;
  });

  /**
   * Read the definition.
   * @param {int} id
   */
  const read = useAPI(async(id) => {
    // Don't read it again
    if (current.value?.id === id) return current;

    // See if it was already loaded
    current.value = all.value.find((d) => d.id === id);
    if (current.value) return current;

    const json = await http_definitions_api
      .url(`/${id}`)
      .get()
      .json()
    ;
    current.value = (new Transformer()).deserialize(Definition, json);
    return current;
  });

  /**
   * Save the coach
   * @param {Coach} coach
   */
  const save = useAPI(async(definition) => {
    const transformer = new Transformer();

    let api = http_definitions_api;
    if (definition.id) api = api.url(`/${definition.id}`);
    api = api.json(transformer.serialize(definition));

    const res = await (definition.id ? api.patch() : api.post());
    current.value = transformer.deserialize(Definition, await res.json());
    if (!definition.id) all.value.push(current.value);

    return current;
  });

  function asOptions() {
    return all.value.reduce(
      (result, definition) => {
        result[definition.id] = definition.name;
        return result;
      },
      {}
    );
  }

  /**
   * Clear all definitions
   */
  function reset() {
    all.value = [];
    current.value = null;
  }

  return {
    all: computed(() => all.value),
    count: computed(() => all.value.length),
    current: computed(() => current.value),
    asOptions: computed(() => asOptions()),
    load,
    read,
    reset,
    save
  };
};

const DefinitionsSymbol = Symbol();

export function useDefinitionStore() {
  return inject(DefinitionsSymbol);
}

export function provideDefinitionStore() {
  provide(DefinitionsSymbol, createDefinitionService());
}
