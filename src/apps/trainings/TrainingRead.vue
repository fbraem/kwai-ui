<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="flex-1 min-w-0">
          <ApplicationHeader :content="$t('title')" />
        </div>
        <div class="mt-5 flex sm:mt-0 sm:ml-4">
          <IconLink
            v-if="training"
            class="hover:bg-hero text-body_dark"
            icon="fas fa-list"
            :route="{
              name: 'trainings.browse',
              params: {
                month: training.event.start_date.format('MM'),
                year: training.event.start_date.format('YYYY')
              }
            }"
          />
        </div>
      </div>
    </PageHeader>
    <PageSection
      v-if="training"
    >
      <TrainingCard :training="training">
        <div class="border-t border-gray-300 p-6">
          <h3>
            {{ $t('title') }} &bull; {{ training.content.title }}
          </h3>
          <p>
            {{ training.content.summary }}
          </p>
          <Alert
            v-if="training.event.cancelled"
            type="danger"
          >
            {{ $t('cancelled' )}}
          </Alert>
        </div>
        <div class="border-t border-gray-300 p-6">
          <div
            v-if="training.coaches"
            class="mb-6"
          >
            <h4>{{ $t('coaches') }}</h4>
            <ul class="list-disc list-inside">
              <li
                v-for="(coach, index) in training.coaches"
                :key="index">
                {{ coach.name }}
              </li>
            </ul>
          </div>
          <div v-if="canManagePresences">
            <h4>{{ $t('training.presences.title') }}</h4>
            <ul class="list-disc list-inside">
              <li
                v-for="(member, index) in training.presences"
                :key="index">
                {{ member.person.name }}
              </li>
            </ul>
          </div>
        </div>
        <div
          v-if="canManagePresences"
          class="flex justify-end border-t border-gray-300 p-6"
        >
          <router-link
            :to="{ name: 'trainings.presences', params: {id: training.id} }"
            class="icon-button text-gray-700 hover:bg-gray-300"
          >
            <i class="fas fa-address-book"></i>
          </router-link>
        </div>
      </TrainingCard>
    </PageSection>
  </div>
</template>

<script>
import messages from './lang';

import Presence from '@/models/trainings/Presence';

import TrainingCard from './TrainingCard.vue';
import Alert from '@/components/Alert.vue';
import {useTrainingStore} from '@/apps/trainings/composables/useTrainings';
import {computed, onMounted, reactive, watch} from '@vue/composition-api';

import PageHeader from '@/components/PageHeader.vue';
import PageSection from '@/components/PageSection.vue';
import ApplicationHeader from '@/components/ApplicationHeader.vue';
import IconLink from '@/components/IconLink.vue';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const trainings = useTrainingStore();

    onMounted(() => {
      trainings.read.run(props.id);
    });
    watch(() => props.id, (newValue) => {
      trainings.read.run(newValue);
    });
    const training = computed(() => trainings.current);

    return {
      trainings: reactive(trainings),
      training
    };
  },
  i18n: messages,
  components: {
    IconLink,
    ApplicationHeader,
    TrainingCard,
    Alert,
    PageSection,
    PageHeader
  },
  computed: {
    day() {
      return this.training.event.start_date.date();
    },
    dayName() {
      return this.training.event.start_date.format('dddd');
    },
    month() {
      return this.training.event.start_date.format('MMMM');
    },
    canManagePresences() {
      return this.$can('manage', Presence);
    }
  }
};
</script>
