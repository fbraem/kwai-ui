<template>
  <router-view :category="application"></router-view>
</template>

<script>
import {provideCoachStore} from '@/apps/trainings/composables/useCoaches';
import {provideSeasonStore} from '@/apps/seasons/composables/useSeasons';
import {provideTeamStore} from '@/apps/teams/composables/useTeams';
import {provideTrainingStore} from '@/apps/trainings/composables/useTrainings';
// eslint-disable-next-line max-len
import {provideDefinitionStore} from '@/apps/trainings/composables/useDefinitions';
import trainingStore from './store/training';

export default {
  setup() {
    provideTrainingStore();
    provideCoachStore();
    provideSeasonStore();
    provideTeamStore();
    provideDefinitionStore();
  },
  computed: {
    application() {
      return this.$store.getters['applications/application']('trainings');
    }
  },
  beforeCreate() {
    this.$store.registerModule('training', trainingStore);
  },
  destroyed() {
    this.$store.unregisterModule(['training']);
  }
};
</script>
