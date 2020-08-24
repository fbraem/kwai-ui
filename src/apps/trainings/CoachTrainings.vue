<template>
  <div class="px-4">
    <h2 v-if="coach">
      {{ $t('training.coaches.trainings', { coach: coach.name }) }}
    </h2>
    <Calendar
      :year="year"
      :month="month"
      :trainings="trainings.all"
      @prevMonth="prevMonth"
      @nextYear="nextYear"
      @nextMonth="nextMonth"
      @prevYear="prevYear"
    />
  </div>
</template>

<script>
import Calendar from './Calendar.vue';

import messages from './lang';
import {useCoachStore} from '@/apps/trainings/composables/useCoaches';
import {computed, onMounted, reactive, watch} from '@vue/composition-api';
import {useTrainingStore} from '@/apps/trainings/composables/useTrainings';

export default {
  props: {
    year: {
      type: Number
    },
    month: {
      type: Number
    },
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const coaches = useCoachStore();
    const trainings = useTrainingStore();

    onMounted(async() => {
      // Force reload, because we use the same store as the trainings page
      await trainings.load.run({
        coach: props.id,
        year: props.year,
        month: props.month
      }, true);
    });
    watch(
      () => [ props.id, props.year, props.month ],
      async() => {
        // Force reload, because we use the same store as the trainings page
        await trainings.load.run({
          coach: props.id,
          year: props.year,
          month: props.month
        }, true);
      }
    );

    const coach = computed(() => coaches.current);

    return {
      coaches: reactive(coaches),
      trainings: reactive(trainings),
      coach
    };
  },
  components: {
    Calendar
  },
  i18n: messages,
  methods: {
    prevYear() {
      this.$router.push({
        name: 'trainings.coaches.trainings',
        params: {
          year: this.year - 1,
          month: this.month,
          id: this.id
        }
      });
    },
    nextYear() {
      this.$router.push({
        name: 'trainings.coaches.trainings',
        params: {
          year: this.year + 1,
          month: this.month,
          id: this.id
        }
      });
    },
    prevMonth() {
      let year = this.year;
      let month = this.month - 1;
      if (month === 0) {
        year = this.year - 1;
        month = 12;
      }
      this.$router.push({
        name: 'trainings.coaches.trainings',
        params: {
          year,
          month,
          id: this.id
        }
      });
    },
    nextMonth() {
      let year = this.year;
      let month = this.month + 1;
      if (month === 13) {
        year = this.year + 1;
        month = 1;
      }
      this.$router.push({
        name: 'trainings.coaches.trainings',
        params: {
          year,
          month,
          id: this.id
        }
      });
    }
  }
};
</script>
