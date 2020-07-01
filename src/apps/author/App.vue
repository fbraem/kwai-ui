<template>
  <div class="container mx-auto bg-white p-4">
    <router-view></router-view>
  </div>
</template>

<style scoped>
</style>

<script>
import store from './store';

export default {
  beforeCreate() {
    this.$store.registerModule('author', store);
  },
  beforeDestroy() {
    this.$store.unregisterModule('author');
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.meta.active) {
        vm.$store.dispatch('author/news/setCurrent', to.meta.active);
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'news.story') {
      to.meta.active = this.$store.getters['author/news/current'];
    }
    next();
  }
};
</script>
