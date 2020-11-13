<template>
  <Header
    :title="$t('categories')"
  />
</template>

<script>
import messages from './lang';

import Header from '@/components/Header';

/**
 * Component for header of the browse page
 */
export default {
  components: {
    Header
  },
  i18n: messages,
};
</script>
