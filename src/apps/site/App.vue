<template>
  <div>
    <router-view name="hero"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
import store from './store';
import newsStore from '@/apps/news/store';

export default {
  beforeCreate() {
    this.$store.registerModule('site', store);
    this.$store.registerModule(['site', 'news'], newsStore);
  },
  beforeDestroy() {
    this.$store.unregisterModule(['site', 'news']);
    this.$store.unregisterModule('site');
  }
};
</script>
