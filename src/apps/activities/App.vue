<template>
  <div>
    <ImageHeader
        v-if="application"
        :title="application.title"
        :pictures="pictures"
    >
      <div v-html="application.description">
      </div>
    </ImageHeader>
    <!-- CONTENT -->
    <div class="container mx-auto flex flex-col p-3">
      <div class="block">
        <HeaderLine tag="h4" content="Nieuws in de kijker" />
        <Spinner v-if="$wait.is('news.browse')" />
        <div v-if="storyCount === 0">
          Momenteel is er geen belangrijk nieuws
        </div>
        <div v-if="stories && stories.length > 0">
          <NewsSlider :stories="stories" />
        </div>
      </div>
      <div
          v-if="application"
          class="block mx-auto my-2"
      >
        <router-link
            :to="moreNewsLink"
            class="red-button"
        >
          Meer nieuws
        </router-link>
      </div>
      <Spinner v-if="$wait.is('pages.browse')" />
      <div
          class="block"
          v-if="pageCount > 0"
      >
        <HeaderLine tag="h4" content="Informatie" />
        <div class="flex flex-wrap">
          <div
              v-for="page in pages"
              :key="page.id"
              class="p-3 w-full sm:w-1/2 lg:w-1/3"
          >
            <PageSummary :page="page" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import newsStore from '@/apps/news/store';
import pageStore from '@/apps/pages/store';
import HeaderLine from '@/components/HeaderLine';
import NewsSlider from '@/apps/news/components/NewsSlider';
import PageSummary from '@/apps/pages/components/PageSummary';
import ImageHeader from '@/components/ImageHeader';
import Spinner from '@/components/Spinner';

export default {
  components: {
    ImageHeader,
    HeaderLine,
    NewsSlider,
    PageSummary,
    Spinner
  },
  beforeCreate() {
    this.$store.registerModule(['activities'], { namespaced: true });
    this.$store.registerModule(['activities', 'news'], newsStore);
    this.$store.registerModule(['activities', 'page'], pageStore);
  },
  beforeDestroy() {
    this.$store.dispatch('activities/news/reset');
    this.$store.unregisterModule(['activities', 'news']);
    this.$store.dispatch('activities/page/reset');
    this.$store.unregisterModule(['activities', 'page']);
    this.$store.unregisterModule(['activities']);
  },
  computed: {
    pictures() {
      return {
        '1024w': require('custom/activities/images/header_lg.jpg'),
        '768w': require('custom/activities/images/header_md.jpg'),
        '640w': require('custom/activities/images/header_sm.jpg'),
      };
    },
    application() {
      // eslint-disable-next-line max-len
      return this.$store.getters['applications/application']('activities');
    },
    stories() {
      return this.$store.state.activities.news.cache[0];
    },
    storyCount() {
      if (this.stories) return this.stories.length;
      return 0;
    },
    pages() {
      return this.$store.state.activities.page.cache[0];
    },
    pageCount() {
      if (this.pages) return this.pages.length;
      return 0;
    },
    pageLink() {
      return {
        name: 'pages.read',
        params: {
          id: this.page.id
        }
      };
    },
    moreNewsLink() {
      return {
        name: 'news.category',
        params: {
          category: this.application.id
        }
      };
    },
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      await vm.fetchData();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await this.fetchData();
    next();
  },
  methods: {
    async fetchData() {
      await this.$store.dispatch('applications/load');
      await this.$store.dispatch('activities/news/load', {
        application: this.application.id,
        promoted: true
      });
      await this.$store.dispatch('activities/page/load', {
        application: this.application.id
      });
    }
  }
};
</script>