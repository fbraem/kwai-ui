<template>
  <div>
    <router-view
        name="hero"
        :seasons="seasons"
    ></router-view>
    <router-view :seasons="seasons"></router-view>
  </div>
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
