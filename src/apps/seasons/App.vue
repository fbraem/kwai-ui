<template>
  <router-view></router-view>
</template>

<script>
import {provideSeasonStore} from '@/apps/seasons/composables/useSeasons';

export default {
  setup() {
    provideSeasonStore();
  }
};
</script>
