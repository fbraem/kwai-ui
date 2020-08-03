<template>
  <div class="container mx-auto flex flex-col p-3">
    <div class="block">
      <HeaderLine tag="h4" :content="$t('featured_news')" />
      <Spinner v-if="$wait.is('news.browse')" />
      <div v-if="storyCount == 0">
        {{ $t('no_featured_news') }}
      </div>
      <div v-if="stories && stories.length > 0">
        <NewsSlider :stories="stories" />
      </div>
    </div>
    <div
      v-if="category"
      class="block mx-auto my-2"
    >
      <router-link
        :to="moreNewsLink"
        class="red-button"
      >
        {{ $t('more_news') }}
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
</template>

<style>
#icon.svg {
  fill:red;
}
</style>

<script>
import messages from './lang';

import NewsSlider from '@/apps/news/components/NewsSlider';
import PageSummary from '@/apps/pages/components/PageSummary';
import Spinner from '@/components/Spinner';
import HeaderLine from '@/components/HeaderLine';

/**
 * Page for showing category news and information
 */
export default {
  i18n: messages,
  components: {
    HeaderLine,
    NewsSlider,
    PageSummary,
    Spinner
  },
  computed: {
    category() {
      if (this.$route.params.id) {
        // eslint-disable-next-line max-len
        return this.$store.getters['applications/applicationWithId'](this.$route.params.id);
      }
      // eslint-disable-next-line max-len
      return this.$store.getters['applications/application'](this.$route.params.app);
    },
    moreNewsLink() {
      return {
        name: 'news.category',
        params: {
          category: this.category.id
        }
      };
    },
    stories() {
      return this.$store.state.category.news.all;
    },
    storyCount() {
      if (this.stories) return this.stories.length;
      return 0;
    },
    pages() {
      return this.$store.state.category.page.all;
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
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      await vm.fetchData(to.params);
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await this.fetchData(to.params);
    next();
  },
  methods: {
    async fetchData(params) {
      await this.$store.dispatch('applications/load');
      await this.$store.dispatch('category/news/load', {
        application: this.category.id,
        featured: true
      });
      await this.$store.dispatch('category/page/load', {
        application: this.category.id
      });
    }
  }
};
</script>
