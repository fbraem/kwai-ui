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
      <div class="container mx-auto px-0 sm:px-4 mb-4 w-full">
        <div class="relative border border-solid border-gray-200 text-base flex flex-col min-w-0 px-3 py-2 flex-auto max-h-full rounded-none sm:rounded-lg bg-teal-900 border-teal-900 text-white">
          <div class="flex flex-col lg:flex-row justify-between items-center py-4 sm:py-3 px-1 sm:px-3">
            <p class="text-base font-semibold mb-6 lg:mb-0">
              Klik op een lid om de aanwezigheid te bevestigen.<br />
              Klik nogmaals om een aanwezigheid te annuleren.
            </p>
            <IconButton
              class="bg-primary hover:bg-primary_dark text-primary_light"
              icon="fas fa-upload"
              content="Upload Registratie"
              :method="switchUpload"
            >
            </IconButton>
          </div>
        </div>
      </div>
      <div
        v-if="showUpload"
        class="container mx-auto px-0 sm:px-4 mb-4"
      >
        <div class="relative border border-solid border-gray-200 text-base flex flex-col min-w-0 px-3 py-2 flex-auto max-h-full rounded-none sm:rounded-lg bg-teal-900 border-teal-900 text-white">
          <div class="flex flex-col lg:flex-row justify-between items-center py-4 sm:py-3 px-1 sm:px-3">
            <VueFileAgent
              ref="registrationFileAgent"
              class="w-full lg:w-2/3"
              theme="list"
              :multiple="true"
              :deletable="true"
              help-text="Selecteer bestand of drop ze hier"
              v-model="registrationFiles"
              @beforedelete="onBeforeDeleteFile($event)"
            >
            </VueFileAgent>
            <div class="w-full lg:w-1/3 flex flex-col items-center justify-center py-4 sm:py-3 px-1 sm:px-3">
              <p>
                Selecteer alle bestanden voor deze training
              </p>
              <IconButton
                class="bg-primary hover:bg-primary_dark text-primary_light"
                icon="fas fa-upload"
                content="Verwerk bestanden"
                :method="upload"
                :disabled="registrationFiles.length === 0"
              >
              </IconButton>
            </div>
          </div>
          <Alert
            v-if="uploadCount > 0"
            type="info"
          >
            <div class="flex flex-wrap">
              <p class="w-full lg:w-2/3 text-sm">
                Aantal leden gevonden in de bestanden: <span class="font-bold">{{ uploadCount }}</span>.<br />
                De leden die nog niet geregistreerd zijn, zijn in onderstaande lijst aangeduid met de kleur oranje.<br />
                <span class="font-bold">Opgelet!</span> Deze gegevens zijn nog
                niet opgeslagen. Klik één voor één op de aangeduide leden, of
                druk op "Bewaar".
              </p>
              <div class="w-full lg:w-1/3 self-center flex flex-row justify-between">
                <IconButton
                  class="bg-primary hover:bg-primary_dark text-primary_light"
                  icon="fas fa-save"
                  content="Bewaar"
                  :method="saveUploadedPresences"
                >
                </IconButton>
                <IconButton
                  class="bg-primary hover:bg-primary_dark text-primary_light"
                  icon="fas fa-undo-alt"
                  content="Reset"
                  :method="resetUpload"
                >
                </IconButton>
              </div>
            </div>
          </Alert>
          <Alert
            class="mt-3"
            type="warning"
            v-if="hasMissingMembers"
          >
            Volgende licensies werden niet gevonden:
            <template v-for="(license, index) in missingMembers">
              <span :key="index">{{ license }}</span>
              <template v-if="index < missingMembers.length - 1">,</template>
            </template>
          </Alert>
        </div>
      </div>
      <HeaderLine v-if="team" :content="`Leden van het team: ${team.name}`" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row-dense gap-4 w-full">
        <div
          v-for="member in teamMembers"
          :key="member.id"
          class="border-2 rounded-md w-full"
          :class="{
            'text-white': presences[member.id] > 0,
            'bg-orange-600': presences[member.id] === 2,
            'bg-green-600': presences[member.id] === 1,
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
            'text-white': presences[member.id] > 0,
            'bg-orange-600': presences[member.id] === 2,
            'bg-green-600': presences[member.id] === 1,
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
// eslint-disable-next-line max-len
import {reactive, set, computed, onMounted, ref, getCurrentInstance} from '@vue/composition-api';
import createMemberService from '@/apps/members/composables/useMembers';
import createTeamService from '@/apps/teams/composables/useTeams';
import HeaderLine from '@/components/HeaderLine';
import Presence from '@/models/trainings/Presence';
import ApplicationHeader from '@/components/ApplicationHeader';
import PageHeader from '@/components/PageHeader';
import IconLink from '@/components/IconLink';

import Vue from 'vue';
import VueFileAgent from 'vue-file-agent';
// eslint-disable-next-line no-unused-vars
import VueFileAgentStyles from 'vue-file-agent/dist/vue-file-agent.css';
import IconButton from '@/components/IconButton';
import {http_auth} from '@/js/http';
import Transformer from '@/js/jsonapi/Transformer';
import Member from '@/models/Member';
import Alert from '@/components/Alert';
Vue.use(VueFileAgent);

const PresenceState = {
  NOT_PRESENT: 0,
  PRESENT: 1,
  UPLOADED: 2
};

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
          set(presences, presence.id, PresenceState.PRESENT);
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
      return members.all.filter(
        (member) =>
          teamMembers.value.findIndex(teamMember => teamMember.id === member.id)
            === -1
      );
    });

    function clickMember(member) {
      const currentState = presences[member.id] || PresenceState.NOT_PRESENT;
      if (currentState === PresenceState.PRESENT) {
        set(presences, member.id, PresenceState.NOT_PRESENT);
      } else {
        set(presences, member.id, PresenceState.PRESENT);
      }
      savePresences();
    }

    async function savePresences() {
      const allPresences = [];
      for (const presence in presences) {
        if (presences[presence] === PresenceState.PRESENT) {
          allPresences.push(new Presence(presence));
        }
      }
      await trainings.savePresences.run(allPresences);
    }

    const registrationFiles = ref([]);
    const showUpload = ref(false);
    function switchUpload() {
      showUpload.value = !showUpload.value;
    }

    // The key is the license. When a member could not be found, the value
    // will be false. Otherwise it will contain the member.
    const uploadedMembers = ref({});
    function resetUpload() {
      uploadedMembers.value = {};
      Object.keys(presences).forEach((p) => {
        if (presences[p] === PresenceState.UPLOADED) {
          set(presences, p, PresenceState.NOT_PRESENT);
        }
      });
    }
    async function upload() {
      resetUpload();
      const xls = registrationFiles.value.map(f => f.file);

      const data = await http_auth
        .url(`trainings/${props.id}/presences/upload`)
        .formData({ xls })
        .post()
        .json()
      ;
      const transformer = new Transformer();
      data.forEach(upload => {
        const members = transformer.deserialize(Member, upload.members);
        // Create a member entry for all licenses found in the uploaded files
        upload.licenses.forEach(
          (license) => { set(uploadedMembers.value, license, false); }
        );
        // If there is a member for a license, set it
        // When the member wasn't mark as present yet, mark it as UPLOADED.
        members.forEach(
          (member) => {
            set(uploadedMembers.value, member.license, member);
            if (!presences[member.id]) {
              set(presences, member.id, PresenceState.UPLOADED);
            }
          }
        );
      });
    }

    // Are there licenses that are not found?
    const hasMissingMembers = computed(() => {
      return Object.values(uploadedMembers.value).some(e => e === false);
    });
    const missingMembers = computed(() => {
      const list = [];
      Object.entries(uploadedMembers.value).reduce(
        (result, current) => {
          const [key, value] = current;
          if (value === false) result.push(key);
          return result;
        }, list);
      return list;
    });

    const uploadCount = computed(() => {
      return Object.keys(uploadedMembers.value).length
        - missingMembers.value.length
      ;
    });

    async function saveUploadedPresences() {
      Object.keys(presences).forEach((p) => {
        if (presences[p] === PresenceState.UPLOADED) {
          set(presences, p, PresenceState.PRESENT);
        }
      });
      await savePresences();
      uploadedMembers.value = {};
      registrationFiles.value = [];
    }

    const vm = getCurrentInstance();
    function onBeforeDeleteFile(fileRecord) {
      vm.$refs.registrationFileAgent.deleteFileRecord(fileRecord);
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
      clickMember,
      switchUpload,
      showUpload,
      upload,
      registrationFiles,
      onBeforeDeleteFile,
      uploadedMembers,
      hasMissingMembers,
      missingMembers,
      uploadCount,
      saveUploadedPresences,
      resetUpload
    };
  },
  i18n: messages,
  components: {
    Alert,
    IconButton,
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
