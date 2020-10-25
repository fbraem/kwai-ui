<template>
  <div>
    <router-view name="hero"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {provideNewsStore} from '@/apps/news/composables/useNews';

export default {
  setup() {
    provideNewsStore();
  }
};
</script>
