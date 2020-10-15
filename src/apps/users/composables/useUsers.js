import {inject, provide, ref, computed} from '@vue/composition-api';
import {useAPI} from '@/js/useAPI';
import {http_api} from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import User from '@/models/users/User';

const http_users_api = http_api.url('admin');

export default function createUserService() {
  const all = ref({});
  const current = ref();
  const count = ref(0);

  const load = useAPI(async(reload = false) => {
    if (!reload && Object.keys(all.value).length > 0) {
      return;
    }

    const json = await http_users_api.get().json();
    count.value = json.meta.count;
    all.value = (new Transformer()).deserialize(User, json)
      .reduce(
        (users, user) => {
          users[user.id] = user;
          return users;
        },
        {}
      )
    ;
  });

  const read = useAPI(async(id) => {
    if (current.value?.id === id) return current;
    if (all.value[id]) {
      current.value = all.value[id];
      return current;
    }

    const json = await http_users_api.url(`/${id}`).get().json();

    current.value = (new Transformer()).deserialize(User, json);
    return current;
  });

  const loadAbilities = useAPI(async(id) => {
    if (current.value?.id === id && current.value.abilities) {
      return current;
    }
    if (all.value[id] && all.value[id].abilities) {
      current.value = all.value[id];
      return current;
    }

    const json = await http_users_api
      .url(`/${id}`)
      .query({ include: 'abilities' })
      .get()
      .json()
    ;
    current.value = (new Transformer()).deserialize(User, json);
    if (all.value[id]) {
      all.value[id] = current.value;
    }

    return current;
  });

  const attachAbility = useAPI(async(id, ability) => {
    const json = await http_users_api
      .url(`/${id}/abilities/${ability.id}`)
      .patch()
      .json()
    ;
    current.value = (new Transformer()).deserialize(User, json);
    if (all.value[id]) {
      all.value[id] = current.value;
    }
    return current;
  });

  const detachAbility = useAPI(async(id, ability) => {
    const json = await http_users_api
      .url(`/${id}/abilities/${ability.id}`)
      .delete()
      .json()
    ;
    current.value = (new Transformer()).deserialize(User, json);
    if (all.value[id]) {
      all.value[id] = current.value;
    }
    return current;
  });

  return {
    all: computed(() => all.value),
    current: computed(() => current.value),
    count: computed(() => count.value),
    load,
    read,
    loadAbilities,
    attachAbility,
    detachAbility
  };
};

const UsersSymbol = Symbol();

export function useUserStore() {
  return inject(UsersSymbol);
}

export function provideUserStore() {
  return provide(UsersSymbol, createUserService());
}
