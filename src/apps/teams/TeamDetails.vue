<template>
  <PageSection>
    <Attributes
      v-if="team"
      :attributes="attributes"
      :title="team.name"
    >
      <template v-slot:value_season="{ attribute }">
        <router-link
          v-if="attribute.value"
          :to="{ name: 'seasons.read', params: { id : attribute.value.id} }"
        >
          {{ attribute.value.name }}
        </router-link>
      </template>
    </Attributes>
    <div
      v-if="team"
      class="flex justify-between border-t mb-2 sm:mb-4 pt-3"
    >
      <div class="flex flex-wrap text-xs">
        <div class="mr-4">
          <strong>Aangemaakt:</strong> {{ localCreatedAt }}
        </div>
        <div>
          <strong>Laatst gewijzigd:</strong> {{ localUpdatedAt }}
        </div>
      </div>
    </div>
  </PageSection>
</template>

<script>
import messages from './lang';

import PageSection from '@/components/PageSection';

import Attributes from '@/components/Attributes';
import { useTeamStore } from '@/apps/teams/composables/useTeams';
import {reactive} from '@vue/composition-api';

export default {
  setup() {
    return {
      teams: reactive(useTeamStore())
    };
  },
  components: {
    Attributes, PageSection
  },
  i18n: messages,
  computed: {
    team() {
      return this.teams.current;
    },
    localCreatedAt() {
      return this.team.formatted_created_at;
    },
    localUpdatedAt() {
      return this.team.formatted_updated_at;
    },
    attributes() {
      return {
        season: {
          label: this.$t('season'),
          value: this.team.season
        },
        members: {
          label: this.$t('members'),
          value: this.team.members_count || 0
        },
        remark: {
          label: this.$t('remark'),
          value: this.team.remark
        },
      };
    }
  }
};
</script>
