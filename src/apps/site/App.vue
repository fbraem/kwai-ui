<template>
  <div>
    <router-view name="hero"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
import store from './store';
import newsStore from './store/news';

export default {
  beforeCreate() {
    this.$store.registerModule('site', store);
    this.$store.registerModule(['site', 'news'], newsStore);
    this.$store.dispatch('category/browse');
  },
  beforeDestroy() {
    this.$store.unregisterModule(['site', 'news']);
    this.$store.unregisterModule('site');
  }
};
</script>
