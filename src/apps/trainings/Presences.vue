<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="flex-1 min-w-0">
          <ApplicationHeader :content="$t('training.presences.title')" />
        </div>
        <div class="mt-5 flex sm:mt-0 sm:ml-4">
          <IconLink
            v-if="training"
            class="hover:bg-hero text-body_dark"
            icon="fas fa-university"
            :route="{ name: 'trainings.read', params: { id: training.id } }"
          />
        </div>
      </div>
    </PageHeader>
    <PageSection>
      <div class="w-full">
        <div class="mx-auto max-w-md">
          <TrainingCard
            v-if="training"
            :training="training"
          >
          </TrainingCard>
        </div>
      </div>
    </PageSection>
    <PageSection>
      <HeaderLine content="Aanwezigen" />
      <p class="text-sm">
        Klik op een lid om de aanwezigheid te bevestigen. Klik nogmaals om een
        aanwezigheid te annuleren.
      </p>
      <HeaderLine v-if="team" :content="`Leden van het team: ${team.name}`" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row-dense gap-4 w-full">
        <div
          v-for="member in teamMembers"
          :key="member.id"
          class="border-2 rounded-md w-full"
          :class="{
            'bg-green-600' : presences[member.id],
            'text-white': presences[member.id]
          }"
        >
          <div class="relative p-2">
            <a @click.prevent="clickMember(member)" class="absolute inset-0"></a>
            <MemberSummary class="flex-grow" :member="member" />
          </div>
        </div>
      </div>
      <HeaderLine
        class="mt-4"
        content="Leden van andere teams"
      />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row-dense gap-4 w-full">
        <div
          v-for="member in otherMembers"
          :key="member.id"
          class="border-2 rounded-md w-full"
          :class="{
            'bg-green-600' : presences[member.id],
            'text-white': presences[member.id]
          }"
        >
          <div class="relative p-2">
            <a @click.prevent="clickMember(member)" class="absolute inset-0"></a>
            <MemberSummary class="flex-grow" :member="member" />
          </div>
        </div>
      </div>
    </PageSection>
  </div>
</template>

<script>
import messages from './lang';

import TrainingCard from './TrainingCard';
import MemberSummary from '@/apps/members/components/MemberSummary';

import PageSection from '@/components/PageSection';
import {useTrainingStore} from '@/apps/trainings/composables/useTrainings';
import {reactive, set, computed, onMounted} from '@vue/composition-api';
import createMemberService from '@/apps/members/composables/useMembers';
import createTeamService from '@/apps/teams/composables/useTeams';
import HeaderLine from '@/components/HeaderLine';
import Presence from '@/models/trainings/Presence';
import ApplicationHeader from '@/components/ApplicationHeader';
import PageHeader from '@/components/PageHeader';
import IconLink from '@/components/IconLink';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const trainings = useTrainingStore();
    const members = createMemberService();
    const teams = createTeamService();
    const presences = reactive({});

    onMounted(async() => {
      await trainings.read.run(props.id, {cache: false});
      if (trainings.current.teams && trainings.current.teams.length > 0) {
        await teams.loadMembers.run(trainings.current.teams[0].id);
      }
      if (trainings.current.presences) {
        trainings.current.presences.forEach((presence) => {
          set(presences, presence.id, true);
        });
      }
    });
    const training = computed(() => trainings.current);
    const team = computed(() => teams.current);
    const teamMembers = computed(() => team.value?.members ?? []);

    onMounted(async() => {
      await members.load.run();
    });
    const otherMembers = computed(() => {
      const others = members.all.filter((member) =>
        teamMembers.value.findIndex(teamMember => teamMember.id === member.id)
          === -1
      );
      return others;
    });

    function clickMember(member) {
      const newPresenceValue = !presences[member.id];
      set(presences, member.id, newPresenceValue);
      const allPresences = [];
      for (const presence in presences) {
        if (presences[presence]) {
          allPresences.push(new Presence(presence));
        }
      }
      trainings.savePresences.run(allPresences);
    }

    return {
      trainings: reactive(trainings),
      members: reactive(members),
      teams: reactive(teams),
      training,
      team,
      teamMembers,
      otherMembers,
      presences,
      clickMember
    };
  },
  i18n: messages,
  components: {
    IconLink,
    ApplicationHeader,
    HeaderLine,
    PageSection,
    PageHeader,
    TrainingCard,
    MemberSummary
  }
};
</script>
