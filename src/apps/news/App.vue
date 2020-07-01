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
import store from './store';
import CategoryCards from '@/apps/categories/components/CategoryCards';

export default {
  components: {
    CategoryCards
  },
  computed: {
    applications() {
      return this.$store.state.applications.all.filter(
        app => app.news
      );
    }
  },
  beforeCreate() {
    this.$store.registerModule('news', store);
  },
  beforeDestroy() {
    this.$store.dispatch('news/reset');
    this.$store.unregisterModule('news');
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.meta.active) {
        vm.$store.dispatch('news/setCurrent', to.meta.active);
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'author.news.update') {
      to.meta.active = this.$store.state.news.current;
    }
    next();
  }
};
</script>
