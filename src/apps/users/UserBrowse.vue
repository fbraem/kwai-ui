<template>
  <div class="mt-6">
    <Spinner v-if="users.load.isRunning">
    </Spinner>
    <div v-else
      class="flex flex-wrap"
    >
      <div
        v-for="user in users.all"
        :key="user.id"
        class="p-3 w-full sm:w-1/2"
      >
          <UserCard :user="user" />
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue';

import messages from './lang';

import UserCard from './components/UserCard.vue';
import {useUserStore} from '@/apps/users/composables/useUsers';
import {reactive} from '@vue/composition-api';

export default {
  setup() {
    const users = useUserStore();

    users.load.run();

    return {
      users: reactive(users)
    };
  },
  i18n: messages,
  components: {
    Spinner,
    UserCard
  },
  computed: {
    noAvatarImage() {
      return require('@/apps/users/images/no_avatar.png');
    },
  },
};
</script>
