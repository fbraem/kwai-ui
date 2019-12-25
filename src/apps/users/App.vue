<template>
  <div>
    <router-view name="hero"></router-view>
    <div class="container mx-auto p-4 lg:p-6">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import userStore from './store/user';
import abilityStore from './store/ability';
import ruleStore from './store/rule';
import newsStore from '@/apps/news/store';
import pageStore from '@/apps/pages/store';

export default {
  beforeCreate() {
    this.$store.registerModule('user', userStore);
    this.$store.registerModule(['user', 'ability'], abilityStore);
    this.$store.registerModule(['user', 'rule'], ruleStore);
    this.$store.registerModule(['user', 'news'], newsStore);
    this.$store.registerModule(['user', 'page'], pageStore);
  },
  beforeDestroy() {
    this.$store.unregisterModule(['user', 'page']);
    this.$store.unregisterModule(['user', 'news']);
    this.$store.unregisterModule(['user', 'rule']);
    this.$store.unregisterModule(['user', 'ability']);
    this.$store.unregisterModule('user');
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.meta.active) {
        vm.$store.dispatch('user/set', to.meta.active);
      }
    });
  }
};
</script>
