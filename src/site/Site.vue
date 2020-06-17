<!-- This template will receive the App component from the active app -->
<template>
  <div class="bg-gray-200">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.$store.dispatch('applications/load');
  },
  beforeDestroy() {
  }
};
</script>
