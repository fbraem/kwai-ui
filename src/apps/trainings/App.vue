<template>
  <router-view></router-view>
</template>

<script>
import {provideCoachStore} from '@/apps/trainings/composables/useCoaches';
import {provideSeasonStore} from '@/apps/seasons/composables/useSeasons';
import {provideTeamStore} from '@/apps/teams/composables/useTeams';
import {provideTrainingStore} from '@/apps/trainings/composables/useTrainings';
// eslint-disable-next-line max-len
import {provideDefinitionStore} from '@/apps/trainings/composables/useDefinitions';
import {provideNewsStore} from '@/apps/news/composables/useNews';
import {providePageStore} from '@/apps/pages/composables/usePages';

export default {
  setup() {
    provideTrainingStore();
    provideCoachStore();
    provideSeasonStore();
    provideTeamStore();
    provideDefinitionStore();
    provideNewsStore();
    providePageStore();
  }
};
</script>
