<template>
  <Header
    :title="$t('user_mgmt')"
    :toolbar="toolbar"
  />
</template>

<script>
import User from '@/models/users/User';

import Header from '@/components/Header.vue';

import messages from './lang';

export default {
  components: {
    Header
  },
  i18n: messages,
  computed: {
    toolbar() {
      const buttons = [];
      if (this.$can('create', User.type())) {
        buttons.push({
          icon: 'fas fa-plus',
          route: {
            name: 'users.invitation'
          }
        });
      }
      return buttons;
    }
  }
};
</script>
