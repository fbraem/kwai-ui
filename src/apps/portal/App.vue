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
    this.$store.registerModule('portal', store);
  },
  beforeDestroy() {
    this.$store.unregisterModule('portal');
  }
};
</script>
