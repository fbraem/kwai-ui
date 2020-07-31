<template>
  <Page>
    <Spinner v-if="$wait.is('pages.browse')" />
    <div class="flex justify-center mb-4">
      <Paginator
        :count="paginator.count"
        :limit="paginator.limit"
        :offset="paginator.offset"
        @page="readPage"
      />
    </div>
    <div class="flex flex-wrap justify-center">
      <div
        class="w-full md:w-1/2 lg:w-1/3 p-4"
        v-for="page in pages"
        :key="page.id"
      >
        <PageSummary :page="page" />
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
    <div
        v-if="! $wait.is('pages.load') && pageCount === 0"
    >
      <Alert type="danger">
        {{ $t('no_pages') }}
      </Alert>
    </div>
    <template slot="sidebar">
      <Sidebar />
    </template>
  </Page>
</template>

<script>
import Page from '@/components/Page';
import PageSummary from './components/PageSummary';
import Paginator from '@/components/Paginator';
import Spinner from '@/components/Spinner';
import Sidebar from './Sidebar';
import Alert from '@/components/Alert';

import messages from './lang';

/**
 * Page for browsing information
 */
export default {
  i18n: messages,
  components: {
    Page,
    Sidebar,
    PageSummary,
    Paginator,
    Spinner,
    Alert
  },
  data() {
    return {
      offset: 0,
      applicationId: null
    };
  },
  computed: {
    pages() {
      return this.$store.state.pages.cache[this.offset];
    },
    pageCount() {
      return this.$store.state.pages.count;
    },
    paginator() {
      return {
        offset: this.offset,
        count: this.$store.state.pages.count,
        limit: 10
      };
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
      if (params.application) {
        this.applicationId = params.application;
      }
      await this.$store.dispatch('pages/load', params);
    },
    async readPage(offset) {
      this.offset = offset;
      await this.fetchData({
        offset,
        application: this.applicationId,
      });
    }
  }
};
</script>
