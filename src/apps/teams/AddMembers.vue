<template>
  <!-- eslint-disable max-len -->
  <div v-if="team">
    <ApplicationHeader content="Leden Toevoegen">
    </ApplicationHeader>
    <p
      v-if="team.team_category"
      class="text-sm"
    >
      {{ $t('add_members_info') }}
    </p>
    <PageSection v-if="!team.team_category">
      <HeaderLine content="Filter" />
      <FormulateForm
        name="addMember"
        v-model="form"
        @submit="loadAvailableMembers"
        @submit-raw="checkValidation"
        class="w-full"
      >
        <div class="flex flex-wrap sm:items-end">
          <div class="w-full sm:w-1/4 px-3 mb-4 sm:mb-0">
            <FormulateInput
              name="start_age"
              :label="$t('min_age')"
            >
            </FormulateInput>
          </div>
          <div class="w-full sm:w-1/4 px-3 mb-4 sm:mb-0">
            <FormulateInput
              name="end_age"
              :label="$t('max_age')"
            >
            </FormulateInput>
          </div>
          <div class="w-full sm:w-1/4 px-3 mb-4 sm:mb-0">
            <FormulateInput
              type="select"
              name="gender"
              :options="genders"
              :label="$t('gender')"
            >
            </FormulateInput>
          </div>
          <div class="w-full sm:w-1/4 px-3 mb-4 sm:mb-0">
            <FormulateInput
              type="submit"
              :input-class="[
              'bg-primary', 'hover:bg-primary_dark', 'text-primary_light'
            ]"
            >
              <i
                v-if="teams.loadAvailableMembers.isRunning"
                class="fas fa-spinner fa-spin mr-2"
              ></i>
              <i v-else class="fas fa-filter mr-2"></i>{{ $t('filter') }}
            </FormulateInput>
          </div>
        </div>
      </FormulateForm>
    </PageSection>
    <PageSection>
      <p
        v-if="! team.team_category"
        class="text-sm"
      >
        {{ $t('use_filter') }}
      </p>
      <p class="text-sm">
        Klik op een lid om te selecteren. Nadat alle nieuwe leden zijn aangeduid
        klik dan op "Bewaar".
      </p>
      <div
        v-if="selection.hasAtLeastOne"
        class="w-full text-center my-2"
      >
        <IconButton
          icon="fa fa-save"
          class="bg-primary hover:bg-primary_dark text-primary_light"
          :content="$t('save')"
          :method="addMembers"
        >
        </IconButton>
      </div>
      <p
        v-if="team.season && teams.availableMembers.length > 0"
        class="text-sm"
        v-html="$t('age_remark', { season : team.season.name, start : team.season.formatted_start_date, end : team.season.formatted_end_date})"
      >
      </p>
      <div
        v-if="teams.loadAvailableMembers.isRunning"
        class="w-full"
      >
        <Spinner class="text-center" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row-dense gap-4 w-full">
        <div
          v-for="member in teams.availableMembers"
          :key="member.id"
          class="border-2 rounded-md w-full"
          :class="{
            'bg-green-600': selection.members[member.id],
            'text-white': selection.members[member.id]
          }"
        >
          <div class="p-2">
            <div class="relative p-2">
              <a
                @click.prevent="selection.select(member)"
                class="absolute inset-0"
              >
              </a>
              <MemberSummary
                class="flex-grow"
                :member="member"
                :date="dateForAge"
              />
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  </div>
</template>

<script>
import messages from './lang';

import Spinner from '@/components/Spinner.vue';
import HeaderLine from '@/components/HeaderLine.vue';
import PageSection from '@/components/PageSection.vue';

import {
  ref, reactive, onMounted, computed, set, getCurrentInstance
} from '@vue/composition-api';
import {useTeamStore} from '@/apps/teams/composables/useTeams';
import MemberSummary from '@/apps/members/components/MemberSummary.vue';
import moment from 'moment';
import ApplicationHeader from '@/components/ApplicationHeader.vue';
import IconButton from '@/components/IconButton.vue';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const teams = useTeamStore();

    const team = computed(() => teams.current);

    const selection = reactive({
      members: {},
      hasAtLeastOne: computed(
        () => Object.values(selection.members).some(element => element)
      ),
      select: (member) => set(
        selection.members,
        member.id,
        !selection.members[member.id]
      )
    });

    async function loadAvailableMembers() {
      selection.members = {};
      await teams.loadAvailableMembers.run(
        props.id,
        {
          start_age: form.value.start_age,
          end_age: form.value.end_age,
          gender: form.value.gender
        }
      );
    };

    const dateForAge = computed(() => {
      if (team.value.season) {
        return team.value.season.end_date;
      }
      return moment();
    });
    const genders = {
      0: 'None',
      1: 'Male',
      2: 'Female'
    };

    onMounted(() => {
      loadAvailableMembers();
    });

    const form = ref({
      start_age: 0,
      end_age: null,
      gender: 0,
      genders
    });
    let hasFormErrors = ref(false);
    let hasValidationErrors = ref(false);

    async function checkValidation(submission) {
      hasValidationErrors.value = await submission.hasValidationErrors();
    }

    const vm = getCurrentInstance();
    async function addMembers() {
      const members = [];
      for (const memberId in selection.members) {
        if (selection.members[memberId]) {
          members.push(teams.availableMembers.find((e) => e.id === memberId));
        }
      }
      await teams.addMembers.run(props.id, members);
      await vm.$router.push({
        name: 'teams.read',
        params: {
          id: props.id
        }
      });
    }

    return {
      teams: reactive(teams),
      team,
      form,
      hasFormErrors,
      hasValidationErrors,
      checkValidation,
      loadAvailableMembers,
      addMembers,
      selection,
      dateForAge,
      genders
    };
  },
  components: {
    IconButton,
    ApplicationHeader,
    MemberSummary,
    HeaderLine,
    Spinner,
    PageSection
  },
  i18n: messages
};
</script>
