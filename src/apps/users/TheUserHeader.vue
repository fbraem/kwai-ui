<template>
  <Header
    :title="$t('user_mgmt')"
    :subtitle="subtitle"
  />
</template>

<script>
import Header from '@/components/Header.vue';

import messages from './lang';
import {useUserStore} from '@/apps/users/composables/useUsers';
import {computed} from '@vue/composition-api';

export default {
  setup() {
    const store = useUserStore();
    const user = store.current;

    const subtitle = computed(() => {
      if (user?.value) {
        const name = user.value.name;
        if (name.length === 0) return user.value.email;
        return name;
      }
      return '';
    });

    return {
      subtitle
    };
  },
  components: {
    Header
  },
  i18n: messages,
};
</script>
