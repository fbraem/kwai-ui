<template>
  <div>
    <PageHeader>
      <ApplicationHeader :content="$t('training.coaches.title')" />
    </PageHeader>
    <Spinner
      class="w-full text-center"
      v-if="coaches.read.isRunning"
    />
    <PageSection>
      <CoachCard
        v-if="coach"
        :coach="coach"
      />
    </PageSection>
    <router-view :id="id" />
  </div>
</template>

<script>
import messages from './lang';

import CoachCard from './components/CoachCard';
import PageHeader from '@/components/PageHeader';
import PageSection from '@/components/PageSection';
import Spinner from '@/components/Spinner';
import {useCoachStore} from '@/apps/trainings/composables/useCoaches';
import {onMounted, reactive, watch, computed} from '@vue/composition-api';
import ApplicationHeader from '@/components/ApplicationHeader';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const coaches = useCoachStore();

    onMounted(() => {
      coaches.read.run(props.id);
    });
    watch(() => props.id, (newValue) => {
      coaches.read.run(newValue);
    });
    const coach = computed(() => coaches.current);

    return {
      coaches: reactive(coaches),
      coach
    };
  },
  components: {
    ApplicationHeader,
    Spinner,
    CoachCard,
    PageHeader,
    PageSection
  },
  i18n: messages
};
</script>
