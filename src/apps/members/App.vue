<template>
  <div>
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
