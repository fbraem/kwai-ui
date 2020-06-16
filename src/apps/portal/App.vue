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
    this.$store.registerModule('portal', store);
    this.$store.registerModule(['portal', 'applications'], applicationStore);
    this.$store.registerModule(['portal', 'news'], newsStore);
    this.$store.dispatch('portal/applications/load');
  },
  beforeDestroy() {
    this.$store.unregisterModule(['portal', 'news']);
    this.$store.unregisterModule(['portal', 'applications']);
    this.$store.unregisterModule('portal');
  }
};
</script>
