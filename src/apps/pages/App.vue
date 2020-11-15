<template>
  <div>
    <router-view name="hero"></router-view>
    <router-view class="container mx-auto p-4 lg:p-6"></router-view>
    <CategoryCards
      v-if="applications"
      :categories="applications"
    />
  </div>
</template>

<script>
import CategoryCards from '@/apps/categories/components/CategoryCards.vue';
import {computed} from '@vue/composition-api';
import {useApplicationStore} from '@/site/composables/useApplications';
import {providePageStore} from '@/apps/pages/composables/usePages';

export default {
  setup() {
    providePageStore();
    const applicationStore = useApplicationStore();

    const applications = computed(() => {
      return applicationStore.all.filter(
        app => app.pages
      );
    });

    return {
      applications
    };
  },
  components: {
    CategoryCards
  }
};
</script>
