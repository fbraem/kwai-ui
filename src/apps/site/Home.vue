<template>
  <!-- eslint-disable max-len -->
  <div class="p-4">
    <div class="hidden sm:block container mx-auto bg-gray-100 mb-4">
      <div class="flex flex-row flex-wrap justify-center p-4">
        <div
          v-for="application in applications"
          :key="application.id"
          class="w-full sm:w-1/2 md:w-1/4"
        >
          <ApplicationCard
            :application="application"
            :icon="$route.meta.icons[application.name]"
          />
        </div>
      </div>
    </div>
    <div class="block sm:hidden mb-4">
      <ApplicationList
        :applications="applications"
        :icons="$route.meta.icons"
      />
    </div>
    <div class="container mx-auto">
      <h2 class="header-line">
        Belangrijk Nieuws
      </h2>
      <div class="flex justify-center">
        <Paginator
          :count="storiesPaginator.count"
          :limit="storiesPaginator.limit"
          :offset="storiesPaginator.offset"
          @page="loadStories"
        />
      </div>
      <Spinner v-if="$wait.is('news.browse')"/>
      <div class="flex flex-wrap justify-center mb-4">
        <div
          v-for="story in stories"
          :key="story.id"
          class="p-2 md:p-4 w-full xl:w-1/2"
        >
          <NewsCard
            :story="story"
            :application="story.application"
          />
        </div>
      </div>
      <div class="flex justify-center">
        <Paginator
          :count="storiesPaginator.count"
          :limit="storiesPaginator.limit"
          :offset="storiesPaginator.offset"
          @page="loadStories"
        />
      </div>
      <div class="block mb-6">
        <router-link
          class="red-button"
          :to="{ name : 'news' }"
        >
          {{ $t('more_news') }}
        </router-link>
      </div>
    </div>
    <div v-if="footerHtml" v-html="footerHtml">
    </div>
  </div>
</template>

<script>
import NewsCard from '@/apps/news/components/NewsCard.vue';
import Paginator from '@/components/Paginator.vue';
import Spinner from '@/components/Spinner.vue';
import ApplicationCard from './components/ApplicationCard';
import ApplicationList from '@/apps/site/components/ApplicationList';

import messages from '../../site/lang';

export default {
  i18n: messages,
  components: {
    NewsCard,
    Paginator,
    Spinner,
    ApplicationCard,
    ApplicationList,
  },
  data() {
    return {
      footerHtml: this.$route.meta.html['./footer.html']
    };
  },
  computed: {
    storiesPaginator() {
      return {
        offset: this.$store.state.site.news.offset,
        count: this.$store.state.site.news.count,
        limit: 10
      }
    },
    storiesOffset() {
      return this.$store.state.site.news.offset;
    },
    stories() {
      return this.$store.getters['site/news/stories'](this.storiesOffset);
    },
    applications() {
      return this.$store.state.site.applications.all;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      await vm.fetchData(to.params);
      next();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await this.fetchData(to.params);
    next();
  },
  methods: {
    async fetchData() {
      await this.loadStories(0);
    },
    async loadStories(offset) {
      try {
        await this.$store.dispatch('site/news/load', {
          offset: offset
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
