<template>
  <div>
    <router-view name="hero"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {provideMemberStore} from '@/apps/members/composables/useMembers';

export default {
  setup() {
    provideMemberStore();
  }
};
</script>
