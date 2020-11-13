<template>
  <div>
    <router-view name="hero"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {providePageStore} from '@/apps/pages/composables/usePages';
import {provideNewsStore} from '@/apps/news/composables/useNews';

export default {
  setup() {
    providePageStore();
    provideNewsStore();
  }
};
</script>
