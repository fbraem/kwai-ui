<template>
  <CategoryList
    v-if="applications"
    :categories="applications"
  />
</template>

<script>
import messages from './lang';

import CategoryList from '@/apps/categories/components/CategoryList.vue';

export default {
  i18n: messages,
  components: {
    CategoryList
  },
  computed: {
    applications() {
      return this.$store.state.applications.all;
    }
  }
};
</script>
