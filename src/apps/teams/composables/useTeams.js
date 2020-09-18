import { ref, computed, provide, inject } from '@vue/composition-api';
import { http_api } from '@/js/http';
import Team from '@/models/Team';
import Transformer from '@/js/jsonapi/Transformer';
import { useAPI } from '@/js/useAPI';

const http_teams_api = http_api.url('teams');

/**
 * State management for Teams
 */
export default function createTeamService() {
  const all = ref([]);
  const current = ref();

  /**
   * Load all teams
   * @param reload
   */
  const load = useAPI(async(reload = false) => {
    if (!reload && all.value.length > 0) return all;

    const json = await http_teams_api.get().json();
    all.value = (new Transformer()).deserialize(Team, json);

    return all;
  });

  /**
   * Read the team
   * @param id
   */
  const read = useAPI(async(id) => {
    // Don't read it again
    if (current.value?.id === id) return current;

    // See if it was already loaded
    current.value = all.value.find((t) => t.id === id);
    if (current.value) return current;

    const json = await http_teams_api.url(`/${id}`)
      .get()
      .json()
    ;

    current.value = (new Transformer()).deserialize(Team, json);
    return current;
  });

  const loadMembers = useAPI(async(id) => {
    if (current.value?.id === id && current.value.members) {
      return;
    }
    current.value = all.value.find((t) => t.id === id);
    if (current.value && current.value.members) return current;

    const api = http_teams_api.query({ include: 'members' });

    const json = await api.url(`/${id}`).get().json();

    current.value = (new Transformer()).deserialize(Team, json);
    return current;
  });

  /**
   * Save the team
   * @param team
   */
  const save = useAPI(async(team) => {
    const transformer = new Transformer();

    let api = http_teams_api;
    if (team.id) api = api.url(`/${team.id}`);
    api = api.json(transformer.serialize(team));

    const res = await (team.id ? api.patch() : api.post());
    current.value = transformer.deserialize(Team, await res.json());
    if (!team.id) all.value.push(current.value);

    return current;
  });

  function asOptions() {
    return all.value.reduce(
      (result, team) => {
        result[team.id] = team.name;
        return result;
      },
      {}
    );
  }

  /**
   * Clear cached teams
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
    loadMembers,
    save,
    asOptions: computed(() => asOptions()),
    reset
  };
}

const TeamsSymbol = Symbol();

export function useTeamStore() {
  return inject(TeamsSymbol);
}

export function provideTeamStore() {
  provide(TeamsSymbol, createTeamService());
}
