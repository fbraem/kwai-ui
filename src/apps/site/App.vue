<template>
  <div>
    <router-view name="hero"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
import store from './store';
import newsStore from './store/news';
import applicationStore from './store/applications';

export default {
  beforeCreate() {
    this.$store.registerModule('site', store);
    this.$store.registerModule(['site', 'applications'], applicationStore);
    this.$store.registerModule(['site', 'news'], newsStore);
    this.$store.dispatch('site/applications/load');
  },
  beforeDestroy() {
    this.$store.unregisterModule(['site', 'news']);
    this.$store.unregisterModule(['site', 'applications']);
    this.$store.unregisterModule('site');
  }
};
</script>
