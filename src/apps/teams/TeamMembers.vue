<template>
  <!-- eslint-disable max-len -->
  <div v-if="team">
    <HeaderLine tag="h2" content="Leden" />
    <Alert
      v-if="team.season"
      type="warning"
      class="mb-4"
    >
      <div v-html="$t('age_remark',
      {
        season: this.team.season.name,
        start: this.team.season.formatted_start_date,
        end: this.team.season.formatted_end_date
      })">
      </div>
    </Alert>
    <div
      v-if="hasMembers"
      class="mb-4"
    >
      {{ $t('count') }} : {{ team.members.length }}
    </div>
    <Alert
      v-else
      type="info"
      class="mb-4"
    >
      {{ $t('no_members') }}
    </Alert>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row-dense gap-4 w-full">
      <div
        v-for="member in team.members"
        :key="member.id"
        class="border-2 rounded-md w-full"
      >
        <div class="p-2">
          <div class="flex">
            <MemberSummary
              class="flex-grow"
              :member="member"
              :date="dateForAge"
            />
            <div>
              <IconLink
                icon="fas fa-trash"
                :method="() => removeMember(member)"
              ></IconLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <IconButton
        v-if="team && $can('attachMember', team)"
        icon="fa fa-plus"
        class="bg-primary hover:bg-primary_dark text-primary_light"
        :content="$t('add')"
        :route="{ name: 'team.add_members', params: { id: team.id }}"
      >
      </IconButton>
    </div>
  </div>
</template>

<script>
import messages from './lang';

import Alert from '@/components/Alert';

import HeaderLine from '@/components/HeaderLine';
import {useTeamStore} from '@/apps/teams/composables/useTeams';
import {reactive, computed} from '@vue/composition-api';
import MemberSummary from '@/apps/members/components/MemberSummary';
import moment from 'moment';
import IconButton from '@/components/IconButton';
import IconLink from '@/components/IconLink';

export default {
  setup() {
    const teams = useTeamStore();
    const team = computed(() => teams.current);
    const hasMembers = computed(
      () => {
        if (team.value.members) return team.value.members.length > 0;
        return false;
      }
    );
    const dateForAge = computed(() => {
      if (team.value.season) {
        return team.value.season.end_date;
      }
      return moment();
    });

    const removeMember = (member) => {
      teams.removeMember.run(team.value.id, member);
    };

    return {
      teams: reactive(teams),
      team,
      hasMembers,
      dateForAge,
      removeMember
    };
  },
  components: {
    IconButton,
    IconLink,
    MemberSummary,
    HeaderLine,
    Alert,
  },
  i18n: messages
};
</script>
