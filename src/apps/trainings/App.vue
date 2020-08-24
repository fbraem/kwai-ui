<template>
  <router-view :category="application"></router-view>
</template>

<script>
import trainingStore from './store/training';
import definitionStore from './store/definition';
import memberStore from '@/apps/members/store';
import {provideCoachStore} from '@/apps/trainings/composables/useCoaches';
import {provideSeasonStore} from '@/apps/seasons/composables/useSeasons';
import {provideTeamStore} from '@/apps/teams/composables/useTeams';
import {provideTrainingStore} from '@/apps/trainings/composables/useTrainings';

export default {
  setup() {
    provideTrainingStore();
    provideCoachStore();
    provideSeasonStore();
    provideTeamStore();
  },
  computed: {
    application() {
      return this.$store.getters['applications/application']('trainings');
    }
  },
  beforeCreate() {
    this.$store.registerModule('training', trainingStore);
    this.$store.registerModule(['training', 'definition'], definitionStore);
    this.$store.registerModule(['training', 'member'], memberStore);
  },
  destroyed() {
    this.$store.unregisterModule(['training', 'definition']);
    this.$store.unregisterModule(['training', 'member']);
    this.$store.unregisterModule('training');
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.meta.active) {
        vm.$store.dispatch('training/set', to.meta.active);
      }
    });
  }
};
</script>
