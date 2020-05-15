<template>
  <div>
    <router-view name="hero"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
import store from './store';

export default {
  beforeCreate() {
    this.$store.registerModule('site', store);
    this.$store.dispatch('category/browse');
  },
  beforeDestroy() {
    this.$store.unregisterModule('site');
  }
};
</script>
