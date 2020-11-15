<template>
  <Header
    :title="$t('users')"
    :subtitle="$t('rules.title')"
    :toolbar="toolbar"
  />
</template>

<script>
import Header from '@/components/Header.vue';

import messages from './lang';

export default {
  components: {
    Header
  },
  i18n: messages,
  computed: {
    toolbar() {
      return [];
    }
  }
};
</script>
