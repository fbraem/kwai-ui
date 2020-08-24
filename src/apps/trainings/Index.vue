<template>
  <!-- eslint-disable max-len -->
  <div>
    <ImageHeader
      v-if="application"
      :title="application.title"
      :pictures="pictures"
      :toolbar="toolbar"
    >
      <div v-html="application.description">
      </div>
    </ImageHeader>
    <div class="container mx-auto flex flex-col">
      <div class="flex flex-wrap">
        <div class="w-full md:w-1/2 p-4">
          <NewsListCard
            :stories="stories"
            :category="category"
            class="h-full"
          />
        </div>
        <div class="w-full md:w-1/2 p-4">
          <PageListCard
            :pages="pages"
            class="h-full"
          />
        </div>
      </div>
      <div class="w-full mb-4 p-3">
        <CoachListCard
          :coaches="coaches.all"
        />
      </div>
      <div class="w-full p-3">
        <div class="flex flex-row">
          <div class="flex-grow">
            <HeaderLine tag="h3" content="Kalender" />
          </div>
          <div>
            <router-link
              class="icon-button text-gray-700 hover:bg-gray-300"
              :to="calendarLink"
            >
              <i class="fas fa-angle-up"></i>
            </router-link>
          </div>
        </div>
        <Calendar
          :year="year"
          :month="month"
          :trainings="trainings.all"
          @prevMonth="prevMonth"
          @prevYear="prevYear"
          @nextMonth="nextMonth"
          @nextYear="nextYear"
        />
      </div>
  </div>
  </div>
</template>

<script>
import moment from 'moment';

import Application from '@/models/Application';
import newsStore from '@/apps/news/store';
import pageStore from '@/apps/pages/store';

import NewsListCard from '@/apps/news/components/NewsListCard';
import PageListCard from '@/apps/pages/components/PageListCard';
import Calendar from '@/apps/trainings/Calendar';
import CoachListCard from './components/CoachListCard';
import HeaderLine from '@/components/HeaderLine';
import {useTrainingStore} from '@/apps/trainings/composables/useTrainings';
import {onMounted, reactive, ref, watch} from '@vue/composition-api';
import {useCoachStore} from '@/apps/trainings/composables/useCoaches';
import Training from '@/models/trainings/Training';
import Team from '@/models/Team';
import Coach from '@/models/trainings/Coach';
import ImageHeader from '@/components/ImageHeader';

export default {
  setup() {
    const trainings = useTrainingStore();
    const coaches = useCoachStore();
    const year = ref(moment().year());
    const month = ref(moment().month() + 1);

    onMounted(() => {
      trainings.load.run();
      coaches.load.run();
    });

    watch(
      [ month, year],
      (newValue) => {
        const [ newMonth, newYear ] = newValue;
        trainings.load.run({
          year: newYear,
          month: newMonth
        }, true);
      }
    );

    return {
      trainings: reactive(trainings),
      coaches: reactive(coaches),
      year,
      month
    };
  },
  components: {
    ImageHeader,
    HeaderLine,
    NewsListCard,
    PageListCard,
    Calendar,
    CoachListCard
  },
  props: {
    category: {
      type: Application
    }
  },
  computed: {
    pictures() {
      return {
        '1024w': require('custom/trainings/images/header_lg.jpg'),
        '768w': require('custom/trainings/images/header_md.jpg'),
        '640w': require('custom/trainings/images/header_sm.jpg'),
      };
    },
    application() {
      return this.$store.getters['applications/application']('trainings');
    },
    stories() {
      return this.$store.state.training.news.cache[0] || [];
    },
    hasStories() {
      return this.stories.length > 0;
    },
    pages() {
      return this.$store.state.training.page.cache[0] || [];
    },
    calendarLink() {
      return {
        name: 'trainings.browse',
        params: {
          year: this.year,
          month: this.month
        }
      };
    },
    toolbar() {
      const buttons = [];
      if (this.$can('create', Training)) {
        buttons.push({
          icon: 'fas fa-calendar-plus',
          route: {
            name: 'trainings.definitions.browse'
          }
        });
        buttons.push({
          icon: 'fas fa-plus',
          route: {
            name: 'trainings.create'
          }
        });
      }
      if (this.$can('manage', Team)) {
        buttons.push({
          icon: 'fas fa-users',
          route: {
            name: 'teams.browse'
          }
        });
      }
      if (this.$can('manage', Coach)) {
        buttons.push({
          icon: 'fas fa-user-tie',
          route: {
            name: 'trainings.coaches'
          }
        });
      }
      return buttons;
    }
  },
  beforeCreate() {
    this.$store.registerModule(['training', 'news'], newsStore);
    this.$store.registerModule(['training', 'page'], pageStore);
  },
  destroyed() {
    this.$store.unregisterModule(['training', 'news']);
    this.$store.unregisterModule(['training', 'page']);
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      if (vm.application?.id) {
        vm.fetchNews(vm.application.id);
        vm.fetchPages(vm.application.id);
      }
      next();
    });
  },
  watch: {
    application(nv, ov) {
      if (nv) {
        this.fetchNews(nv.id);
        this.fetchPages(nv.id);
      }
    }
  },
  methods: {
    fetchNews(applicationId) {
      this.$store.dispatch('training/news/load', {
        application: applicationId,
        promoted: true
      });
    },
    fetchPages(applicationId) {
      this.$store.dispatch('training/page/load', {
        application: applicationId
      });
    },
    prevYear() {
      this.year -= 1;
      this.trainings.load.run({
        year: this.year,
        month: this.month
      }, true);
    },
    nextYear() {
      this.year += 1;
    },
    prevMonth() {
      this.month = this.month - 1;
      if (this.month === 0) {
        this.year = this.year - 1;
        this.month = 12;
      }
    },
    nextMonth() {
      this.month = this.month + 1;
      if (this.month === 13) {
        this.year = this.year + 1;
        this.month = 1;
      }
    }
  }
};
</script>
