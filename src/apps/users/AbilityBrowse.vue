<template>
  <!-- eslint-disable max-len -->
  <div class="container mt-6 mx-auto">
    <ul>
      <li
        v-for="ability in store.all"
        :key="ability.id"
        class="px-2 py-2 first:border-t border-b border-gray-400 odd:bg-gray-200"
      >
        <Ability
          :ability="ability"
          class="ml-4"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import Ability from './TheUserAbility.vue';

import messages from './lang';
import {useAbilityStore} from '@/apps/users/composables/useAbilities';
import {onMounted, reactive} from '@vue/composition-api';

export default {
  setup() {
    const store = useAbilityStore();

    onMounted(() => {
      store.load.run(true);
    });

    return {
      store: reactive(store)
    };
  },
  components: {
    Ability
  },
  i18n: messages
};
</script>
