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
            :category="application"
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

import NewsListCard from '@/apps/news/components/NewsListCard';
import PageListCard from '@/apps/pages/components/PageListCard';
import Calendar from '@/apps/trainings/Calendar';
import CoachListCard from './components/CoachListCard';
import HeaderLine from '@/components/HeaderLine';
import {useTrainingStore} from '@/apps/trainings/composables/useTrainings';
import {onMounted, reactive, ref, watch, computed} from '@vue/composition-api';
import {useCoachStore} from '@/apps/trainings/composables/useCoaches';
import Training from '@/models/trainings/Training';
import Team from '@/models/Team';
import Coach from '@/models/trainings/Coach';
import ImageHeader from '@/components/ImageHeader';
import {useNewsStore} from '@/apps/news/composables/useNews';
import {usePageStore} from '@/apps/pages/composables/usePages';
import useApplications from '@/site/composables/useApplications';

export default {
  setup(props) {
    const trainings = useTrainingStore();
    const coaches = useCoachStore();
    const year = ref(moment().year());
    const month = ref(moment().month() + 1);

    onMounted(() => {
      trainings.load.run();
      coaches.load.run();
    });

    const newsStore = useNewsStore();
    const stories = computed(() => newsStore.all.value);

    const pageStore = usePageStore();
    const pages = computed(() => pageStore.all.value);

    const applicationStore = useApplications();
    const application = computed(() => {
      if (applicationStore.all.value) {
        return applicationStore.all.value.find(a => a.name === 'trainings');
      }
      return null;
    });

    if (application.value) {
      onMounted(() => {
        newsStore.load.run({
          promoted: true,
          application: application.value.id
        });
        pageStore.load.run({application: application.value.id});
      });
    }

    watch(
      () => application.value,
      () => {
        if (application.value) {
          newsStore.load.run({
            promoted: true,
            application: application.value.id
          });
          pageStore.load.run({application: application.value.id});
        }
      }
    );

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
      // applications: reactive(applicationStore),
      year,
      month,
      application,
      stories,
      pages
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
  computed: {
    pictures() {
      return {
        '1024w': require('custom/trainings/images/header_lg.jpg'),
        '768w': require('custom/trainings/images/header_md.jpg'),
        '640w': require('custom/trainings/images/header_sm.jpg'),
      };
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
  methods: {
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
