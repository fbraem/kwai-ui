<template>
  <router-view
    :seasons="seasons"
  >
  </router-view>
</template>

<script>
import useSeasons from '@/apps/seasons/composables/useSeasons';

export default {
  setup() {
    return {
      seasons: {
        ...useSeasons()
      }
    };
  }
};
</script>
