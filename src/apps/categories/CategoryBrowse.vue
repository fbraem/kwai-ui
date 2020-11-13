<template>
  <div class="container mx-auto">
    <div
      v-for="application in applications"
      :key="application.id"
    >
      <CategoryCard :category="application" />
    </div>
  </div>
</template>

<script>
import CategoryCard from './components/CategoryCard.vue';

import messages from './lang';
import useApplications from '@/site/composables/useApplications';
import {computed} from '@vue/composition-api';
/**
 * Page for showing all categories
 */
export default {
  setup() {
    const applicationStore = useApplications();

    const applications = computed(() => applicationStore.all.value);

    return {
      applications
    };
  },
  components: {
    CategoryCard
  },
  i18n: messages
};
</script>
