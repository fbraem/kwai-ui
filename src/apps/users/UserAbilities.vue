<template>
  <!-- eslint-disable max-len -->
  <Page>
    <template slot="sidebar">
      <UserCard
        v-if="user"
        :user="user"
      />
    </template>
    <div>
      <h1>{{ $t('rules.groups') }}</h1>
      <p class="text-sm">
        {{ $t('rules.groups_info') }}
      </p>
      <ul v-if="user">
        <li
          v-for="ability in user.abilities"
          :key="ability.id"
          class="px-2 py-2 first:border-t border-b border-gray-400 odd:bg-gray-200"
        >
          <UserAbility
            :ability="ability"
            :remove="true"
            @remove="removeAbility"
            class="ml-4"
          />
        </li>
      </ul>
      <h1>Available groups</h1>
      <ul v-if="user">
        <li
          v-for="ability in availableAbilities"
          :key="ability.id"
          class="px-2 py-2 first:border-t border-b border-gray-400 odd:bg-gray-200"
        >
          <UserAbility
            :ability="ability"
            :add="true"
            @add="addAbility"
            class="ml-4"
          />
        </li>
      </ul>
    </div>
  </Page>
</template>

<script>
import UserCard from './components/UserCard.vue';
import UserAbility from './TheUserAbility.vue';
import Page from '@/components/Page.vue';

import messages from './lang';
import {useUserStore} from '@/apps/users/composables/useUsers';
import {onMounted, reactive, computed} from '@vue/composition-api';
import {useAbilityStore} from '@/apps/users/composables/useAbilities';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const userStore = useUserStore();

    const user = computed(() => userStore.current);

    onMounted(async() => {
      await userStore.loadAbilities.run(props.id);
    });

    const addAbility = async(ability) => {
      await userStore.attachAbility.run(props.id, ability);
    };
    const removeAbility = async(ability) => {
      await userStore.detachAbility.run(props.id, ability);
    };

    const abilityStore = useAbilityStore();
    onMounted(async() => {
      await abilityStore.load.run();
    });

    const availableAbilities = computed(() => {
      if (user.value?.abilities) {
        const userAbilities = user.value.abilities.map(x => x.name);
        return Object.values(abilityStore.all.value)
          .filter(x => !userAbilities.includes(x.name));
      }
      return [];
    });

    return {
      store: reactive(userStore),
      user,
      addAbility,
      removeAbility,
      availableAbilities
    };
  },
  i18n: messages,
  components: {
    UserCard, UserAbility, Page
  }
};
</script>
