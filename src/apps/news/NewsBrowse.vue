<template>
  <Page>
    <div>
      <div class="flex justify-center mb-4">
        <Paginator
          :count="paginator.count"
          :limit="paginator.limit"
          :offset="paginator.offset"
          @page="readPage"
        />
      </div>
      <div class="flex flex-wrap justify-center mb-4">
        <Spinner v-if="$wait.is('news.load')" />
        <div
          v-for="story in stories"
          :key="story.id"
          class="p-2 w-full"
        >
          <NewsCard :story="story" />
        </div>
      </div>
      <div class="flex justify-center mb-4">
        <Paginator
          :count="paginator.count"
          :limit="paginator.limit"
          :offset="paginator.offset"
          @page="readPage"
        />
      </div>
    </div>
    <div
      v-if="! $wait.is('news.load') && newsCount === 0"
    >
      <Alert type="danger">
        {{ $t('no_news') }}
      </Alert>
    </div>
    <template slot="sidebar">
      <Sidebar />
    </template>
  </Page>
</template>

<script>
import Page from '@/components/Page';
import Sidebar from './Sidebar';
import NewsCard from './components/NewsCard.vue';
import Paginator from '@/components/Paginator.vue';
import Spinner from '@/components/Spinner';
import Alert from '@/components/Alert';

import messages from './lang';

export default {
  i18n: messages,
  components: {
    Page,
    NewsCard,
    Paginator,
    Spinner,
    Alert,
    Sidebar
  },
  data() {
    return {
      offset: 0,
      categoryId: null
    };
  },
  computed: {
    paginator() {
      return {
        offset: this.offset,
        count: this.$store.state.news.count,
        limit: 10
      };
    },
    stories() {
      return this.$store.state.news.cache[this.offset];
    },
    newsCount() {
      return this.$store.state.news.count;
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
    async fetchData(params) {
      if (params.category) {
        this.categoryId = params.category;
      }
      await this.$store.dispatch('news/load', {
        year: params.year,
        month: params.month,
        category: params.category,
        featured: params.featured
      });
    },
    async readPage(offset) {
      await this.$store.dispatch('news/load', {
        offset: offset,
        year: this.year,
        month: this.month,
        category: this.categoryId,
        featured: this.featured
      });
      this.offset = offset;
    }
  }
};
</script>
