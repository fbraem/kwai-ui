<template>
  <!-- eslint-disable max-len -->
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
        :coaches="coaches"
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
        :trainings="trainings"
        @prevMonth="prevMonth"
        @prevYear="prevYear"
        @nextMonth="nextMonth"
        @nextYear="nextYear"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import Category from '@/models/Category';
import newsStore from '@/apps/news/store';
import pageStore from '@/apps/pages/store';

import NewsListCard from '@/apps/news/components/NewsListCard';
import PageListCard from '@/apps/pages/components/PageListCard';
import Calendar from '@/apps/trainings/Calendar';
import CoachListCard from './components/CoachListCard';
import HeaderLine from '@/components/HeaderLine';

export default {
  components: {
    HeaderLine,
    NewsListCard,
    PageListCard,
    Calendar,
    CoachListCard
  },
  props: {
    category: {
      type: Category
    }
  },
  data() {
    return {
      year: moment().year(),
      month: moment().month() + 1,
    };
  },
  computed: {
    stories() {
      return this.$store.state.training.news.all || [];
    },
    hasStories() {
      return this.stories.length > 0;
    },
    pages() {
      return this.$store.state.training.page.all || [];
    },
    coaches() {
      return this.$store.state.training.coach.all || [];
    },
    trainings() {
      return this.$store.state.training.all || [];
    },
    calendarLink() {
      return {
        name: 'trainings.browse',
        params: {
          year: this.year,
          month: this.month
        }
      };
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
    console.log('bre - trainings');
    next(async(vm) => {
      await vm.fetchData(to.params);
      if (vm.category?.id) {
        vm.fetchNews(vm.category.id);
        vm.fetchPages(vm.category.id);
      }
      next();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    console.log('bru - trainings');
    await this.fetchData(to.params);
    next();
  },
  watch: {
    category(nv, ov) {
      if (nv) {
        this.fetchNews(nv.id);
        this.fetchPages(nv.id);
      }
    }
  },
  methods: {
    async fetchData(params) {
      this.$store.dispatch('training/browse', {
        year: this.year,
        month: this.month
      });
      this.$store.dispatch('training/coach/browse');
    },
    fetchNews(categoryId) {
      this.$store.dispatch('training/news/browse', {
        category: categoryId,
        featured: true
      });
    },
    fetchPages(categoryId) {
      this.$store.dispatch('training/page/browse', {
        category: categoryId
      });
    },
    prevYear() {
      this.year -= 1;
      this.$store.dispatch('training/browse', {
        year: this.year,
        month: this.month
      });
    },
    nextYear() {
      this.year += 1;
      this.$store.dispatch('training/browse', {
        year: this.year,
        month: this.month
      });
    },
    prevMonth() {
      this.month = this.month - 1;
      if (this.month === 0) {
        this.year = this.year - 1;
        this.month = 12;
      }
      this.$store.dispatch('training/browse', {
        year: this.year,
        month: this.month
      });
    },
    nextMonth() {
      this.month = this.month + 1;
      if (this.month === 13) {
        this.year = this.year + 1;
        this.month = 1;
      }
      this.$store.dispatch('training/browse', {
        year: this.year,
        month: this.month
      });
    }
  }
};
</script>
