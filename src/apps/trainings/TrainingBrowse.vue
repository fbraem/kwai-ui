<template>
  <!-- eslint-disable max-len -->
  <div>
    <div v-if="$wait.is('training.browse')"
      class="uk-flex-center" uk-grid>
      <div class="uk-text-center">
        <i class="fas fa-spinner fa-2x fa-spin"></i>
      </div>
    </div>
    <div v-else class="uk-child-width-1-1" uk-grid>
      <Calendar :year="year" :month="month" :trainings="trainings"
        @prevMonth="prevMonth" @firstMonth="firstMonth"
        @nextMonth="nextMonth" @lastMonth="lastMonth" />
      <div v-if="noData">
        <div class="uk-alert uk-alert-warning">
          {{ $t('training.events.no_data') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from './Calendar.vue';

import messages from './lang';

export default {
  components: {
    Calendar
  },
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
  i18n: messages,
  computed: {
    trainings() {
      var trainings = this.$store.state.training.trainings;
      return trainings || [];
    },
    noData() {
      return this.trainings.length === 0;
    },
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      await vm.fetchData(to.params.year, to.params.month);
      next();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await this.fetchData(to.params.year, to.params.month);
    next();
  },
  methods: {
    fetchData(year, month) {
      this.$store.dispatch('training/browse', {
        year: year,
        month: month
      });
    },
    firstMonth() {
      this.$router.push({
        name: 'trainings.browse',
        params: {
          year: this.year,
          month: 1
        }
      });
    },
    lastMonth() {
      this.$router.push({
        name: 'trainings.browse',
        params: {
          year: this.year,
          month: 12
        }
      });
    },
    prevMonth() {
      var year = this.year;
      var month = this.month - 1;
      if (month === 0) {
        year = this.year - 1;
        month = 12;
      }
      this.$router.push({
        name: 'trainings.browse',
        params: {
          year,
          month
        }
      });
    },
    nextMonth() {
      var year = this.year;
      var month = this.month + 1;
      if (month === 13) {
        year = this.year + 1;
        month = 1;
      }
      this.$router.push({
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