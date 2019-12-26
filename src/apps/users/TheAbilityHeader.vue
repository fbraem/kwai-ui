<template>
  <Header
    v-if="ability"
    :title="$t('rules.title')"
    :toolbar="toolbar"
  />
</template>

<script>
import Header from '@/components/Header';

import Ability from '@/models/users/Ability';

import messages from './lang';

export default {
  components: {
    Header
  },
  i18n: messages,
  computed: {
    ability() {
      return this.$store.state.user.ability.active;
    },
    toolbar() {
      const buttons = [];
      if (this.$can('update', Ability.type())) {
        buttons.push({
          icon: 'fas fa-edit',
          route: {
            name: 'users.abilities.update',
            params: {
              id: this.ability.id
            }
          }
        });
      }
      return buttons;
    }
  }
};
</script>
