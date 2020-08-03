<template>
  <div class="news">
    <router-view name="hero"></router-view>
    <div class="container mx-auto p-4 lg:p-6">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import newsStore from '@/apps/news/store';
import pageStore from '@/apps/pages/store';

export default {
  beforeCreate() {
    this.$store.registerModule(['category'], { namespaced: true });
    this.$store.registerModule(['category', 'news'], newsStore);
    this.$store.registerModule(['category', 'page'], pageStore);
  },
  beforeDestroy() {
    this.$store.dispatch('category/news/reset');
    this.$store.unregisterModule(['category', 'news']);
    this.$store.dispatch('category/page/reset');
    this.$store.unregisterModule(['category', 'page']);
    this.$store.unregisterModule(['category']);
  }
};
</script>
