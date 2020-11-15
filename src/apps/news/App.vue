<template>
  <div class="news">
    <router-view name="hero"></router-view>
    <router-view class="container mx-auto p-4 lg:p-6">
    </router-view>
    <CategoryCards
      v-if="applications"
      :categories="applications"
    />
  </div>
</template>

<script>
import CategoryCards from '@/apps/categories/components/CategoryCards.vue';
import {provideNewsStore} from '@/apps/news/composables/useNews';
import {useApplicationStore} from '@/site/composables/useApplications';
import {computed} from '@vue/composition-api';

export default {
  setup() {
    provideNewsStore();
    const applicationStore = useApplicationStore();

    const applications = computed(() => {
      return applicationStore.all.filter(
        app => app.news
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
