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
import CategoryCards from '@/apps/categories/components/CategoryCards';
import {provideNewsStore} from '@/apps/news/composables/useNews';

export default {
  setup() {
    provideNewsStore();
  },
  components: {
    CategoryCards
  },
  computed: {
    applications() {
      return this.$store.state.applications.all.filter(
        app => app.news
      );
    }
  }
};
</script>
