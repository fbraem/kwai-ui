<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import { provideTeamStore } from '@/apps/teams/composables/useTeams';
// eslint-disable-next-line max-len
import { provideTeamCategoryStore } from '@/apps/teams/composables/useTeamCategories';
import {provideSeasonStore} from '@/apps/seasons/composables/useSeasons';

export default {
  setup() {
    provideTeamStore();
    provideTeamCategoryStore();
    provideSeasonStore();
  }
};
</script>
