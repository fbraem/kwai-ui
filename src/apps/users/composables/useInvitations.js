import {inject, provide, ref, computed, set} from '@vue/composition-api';
import {useAPI} from '@/js/useAPI';
import {http_api} from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import Invitation from '@/models/users/Invitation';

const http_invitations_api = http_api.url('admin/invitations');

export default function createInvitationService() {
  const all = ref({});
  const current = ref();
  const count = ref(0);

  const load = useAPI(async(reload = false) => {
    if (!reload && Object.keys(all.value).length > 0) {
      return;
    }

    const json = await http_invitations_api.get().json();
    all.value = (new Transformer()).deserialize(Invitation, json)
      .reduce(
        (abilities, ability) => {
          abilities[ability.id] = ability;
          return abilities;
        },
        {}
      )
    ;
    count.value = json.meta?.count ?? Object.keys(all.value).length;
  });

  const read = useAPI(async(id) => {
    if (current.value?.id === id) return current;
    if (all.value[id]) {
      current.value = all.value[id];
      return current;
    }

    const json = await http_invitations_api.url(`/${id}`).get().json();

    current.value = (new Transformer()).deserialize(Invitation, json);
    return current;
  });

  const readWithToken = useAPI(async(token) => {
    const json = await http_api.url(`user/invitations/${token}`).get().json();
    current.value = (new Transformer()).deserialize(Invitation, json);
    return current;
  });

  const confirm = useAPI(async(token, user) => {
    const transformer = new Transformer();
    const json = await http_api
      .url(`user/invitations/${token}`)
      .json(transformer.serialize(user))
      .post()
      .json()
    ;
    console.log(json);
  });

  const save = useAPI(async(invitation) => {
    const transformer = new Transformer();

    let api = http_invitations_api;
    if (invitation.id) api = api.url(`/${invitation.id}`);
    api = api.json(transformer.serialize(invitation));

    const json = await (invitation.id ? api.patch() : api.post()).json();
    current.value = transformer.deserialize(Invitation, json);
    if (!invitation.id) set(all.value, invitation.id, current.value);

    return current;
  });

  return {
    all: computed(() => all.value),
    current: computed(() => current.value),
    count: computed(() => count.value),
    load,
    read,
    readWithToken,
    confirm,
    save
  };
};

const InvitationsSymbol = Symbol();

export function useInvitationStore() {
  return inject(InvitationsSymbol);
}

export function provideInvitationStore() {
  return provide(InvitationsSymbol, createInvitationService());
}
