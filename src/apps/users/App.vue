<template>
  <div>
    <router-view name="hero"></router-view>
    <div class="container mx-auto p-4 lg:p-6">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {provideUserStore} from '@/apps/users/composables/useUsers';
import {provideNewsStore} from '@/apps/users/composables/useNews';
import {providePageStore} from '@/apps/users/composables/usePages';
import {provideAbilityStore} from '@/apps/users/composables/useAbilities';
import {provideRuleStore} from '@/apps/users/composables/useRules';

export default {
  setup() {
    provideUserStore();
    provideNewsStore();
    providePageStore();
    provideAbilityStore();
    provideRuleStore();
  },
};
</script>
