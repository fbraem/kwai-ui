<template>
  <div class="container mx-auto mt-6">
    <Spinner
      v-if="trainings.load.isRunning"
      class="text-center"
    >
    </Spinner>
    <div
      v-else
      class="mb-6"
    >
      <Calendar
        :year="year"
        :month="month"
        :trainings="trainings.all"
        @prevMonth="prevMonth"
        @prevYear="prevYear"
        @nextMonth="nextMonth"
        @nextYear="nextYear"
      />
      <Alert
        v-if="trainings.all.length === 0"
        type="warning"
      >
        {{ $t('training.events.no_data') }}
      </Alert>
    </div>
  </div>
</template>

<script>
import Calendar from './Calendar';
import Spinner from '@/components/Spinner';
import Alert from '@/components/Alert';

import messages from './lang';
import {useTrainingStore} from '@/apps/trainings/composables/useTrainings';
import {onMounted, reactive, watch} from '@vue/composition-api';

export default {
  props: {
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const trainings = useTrainingStore();

    onMounted(() => {
      trainings.load.run({ ...props }, true);
    });

    watch(() => [ props.year, props.month ], () => {
      trainings.load.run({ ...props }, true);
    });

    return {
      trainings: reactive(trainings)
    };
  },
  components: {
    Calendar, Spinner, Alert
  },
  i18n: messages,
  methods: {
    async prevYear() {
      await this.$router.push({
        name: 'trainings.browse',
        params: {
          year: this.year - 1,
          month: this.month
        }
      });
    },
    async nextYear() {
      await this.$router.push({
        name: 'trainings.browse',
        params: {
          year: this.year + 1,
          month: this.month
        }
      });
    },
    async prevMonth() {
      let year = this.year;
      let month = this.month - 1;
      if (month === 0) {
        year = this.year - 1;
        month = 12;
      }
      await this.$router.push({
        name: 'trainings.browse',
        params: {
          year,
          month
        }
      });
    },
    async nextMonth() {
      let year = this.year;
      let month = this.month + 1;
      if (month === 13) {
        year = this.year + 1;
        month = 1;
      }
      await this.$router.push({
        name: 'trainings.browse',
        params: {
          year,
          month
        }
      });
    }
  }
};
</script>
