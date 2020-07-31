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
import store from './store';
import CategoryCards from '@/apps/categories/components/CategoryCards';

export default {
  components: {
    CategoryCards
  },
  computed: {
    applications() {
      return this.$store.state.applications.all.filter(
        app => app.pages
      );
    }
  },
  beforeCreate() {
    this.$store.registerModule('pages', store);
  },
  beforeDestroy() {
    this.$store.dispatch('pages/reset');
    this.$store.unregisterModule('pages');
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.meta.active) {
        vm.$store.dispatch('pages/setCurrent', to.meta.active);
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'author.page.update') {
      to.meta.active = this.$store.state.page.current;
    }
    next();
  }
};
</script>
