<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageSectionHeader :title="$t('pages.title')">
      <p class="leading-relaxed text-base">
        {{ $t('pages.intro') }}
      </p>
      <div class="flex flex-col md:flex-row w-full md:mt-4 mt-6 md:justify-start justify-center items-center">
        <IconButton
          v-if="canCreate"
          class="bg-primary hover:bg-primary_dark text-primary_light m-2"
          icon="fas fa-file-alt"
          :content="$t('pages.create')"
          :route="{ name: 'author.pages.create' }"
        />
      </div>
    </PageSectionHeader>
    <PageSection v-if="error">
      <Alert
        type="danger"
        class="w-full"
      >
        {{ error.response.status }} - {{ error.response.statusText }}
      </Alert>
    </PageSection>
    <PageSection v-else>
      <div class="rounded-lg p-4 flex flex-col border border-gray-600 border-solid w-full mx-auto max-w-2xl">
        <h2>
          Filter
        </h2>
        <FormulateForm
          name="filterForm"
          v-model="filter"
          @submit="submitFilter"
        >
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2 flex-grow mb-3 md:mb-0">
              <FormulateInput
                type="select"
                name="application"
                :label="$t('pages.filter.application.label')"
                :options="applications"
                :help="$t('pages.filter.application.help')"
                :placeholder="$t('pages.filter.application.placeholder')"
              />
            </div>
            <div class="w-full sm:w-1/2 flex-grow mb-3 md:mb-0 sm:px-3">
              <FormulateInput
                type="select"
                name="sort"
                :label="$t('pages.filter.sort.label')"
                :options="sort"
                :help="$t('pages.filter.sort.help')"
                :placeholder="$t('pages.filter.sort.placeholder')"
              />
            </div>
          </div>
          <div class="flex sm:justify-end justify-between sm:space-x-2 items-center">
            <FormulateInput
              type="button"
              :input-class="['bg-primary', 'hover:bg-primary_dark', 'text-primary_light']"
              @click="resetFilter"
            >
              <i
                v-if="action === 'reset' && loading"
                class="fas fa-spinner fa-spin mr-2"
              ></i>
              <i v-else class="fas fa-undo mr-2"></i>Reset
            </FormulateInput>
            <FormulateInput
              type="submit"
              :input-class="['bg-primary', 'hover:bg-primary_dark', 'text-primary_light']"
            >
              <i
                v-if="action === 'filter' && loading"
                class="fas fa-spinner fa-spin mr-2"
              ></i>
              <i v-else class="fas fa-filter mr-2"></i>
              Filter
            </FormulateInput>
          </div>
        </FormulateForm>
      </div>
    </PageSection>
    <PageSection>
      <div
        v-if="count > limit"
        class="flex-col sm:flex-row flex-1 flex items-center sm:justify-between"
      >
        <div>
          <p class="text-sm leading-5 text-gray-700 mb-2 sm:mb-0">
            {{ $t('pages.showing') }}
            <span class="font-medium">
              {{ from }}
            </span>
            {{ $t('pages.to') }}
            <span class="font-medium">
              {{ to }}
            </span>
            {{ $t('pages.of') }}
            <span class="font-medium">
              {{ count }}
            </span>
            {{ $t('pages.articles') }}
          </p>
        </div>
        <div>
          <Paginator
            :limit="limit"
            :offset="offset"
            :count="count"
            @page="readPage"
          />
        </div>
      </div>
      <div
        v-for="page in pages"
        :key="page.id"
        class="py-8 flex flex-wrap md:flex-no-wrap w-full"
      >
        <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
          <h2 class="tracking-widest font-medium mb-0">{{ page.application.title }}</h2>
        </div>
        <div class="md:flex-grow">
          <h2 class="text-2xl font-medium title-font mb-2">{{ page.content.title }}</h2>
          <div class="leading-relaxed" v-html="page.content.html_summary">
          </div>
          <div class="flex justify-between">
            <Link
              class="mt-2"
              :content="$t('news.read_more')"
              :route="{ name: 'pages.read', params: { id: page.id }}"
              icon="fas fa-arrow-right"
            />
            <Link
              v-if="$can('update', page)"
              class="mt-2"
              :content="$t('news.edit')"
              :route="{ name: 'author.pages.update', params: { id: page.id }}"
              icon="fas fa-edit"
            />
          </div>
        </div>
      </div>
    </PageSection>
  </div>
</template>

<script>
import PageSection from '@/components/PageSection';
import PageSectionHeader from '@/components/PageSectionHeader';
import IconButton from '@/components/IconButton';
import Paginator from '@/components/Paginator';
import Page from '@/models/Page';
import Link from '@/components/Link';
import Alert from '@/components/Alert';

import lang from './lang';

export default {
  components: {
    PageSectionHeader,
    PageSection,
    IconButton,
    Paginator,
    Link,
    Alert
  },
  i18n: lang,
  data() {
    return {
      offset: 0,
      limit: 5,
      filter: {
        application: 0,
        sort: 0
      },
      sort: {
        1: this.$t('pages.filter.sort.options.application'),
        2: this.$t('pages.filter.sort.options.creation_date'),
      },
      action: null
    };
  },
  computed: {
    applications() {
      return this.$store.getters['applications/asOptions'](
        (application) => application.pages
      );
    },
    canCreate() {
      return this.$can('create', Page);
    },
    count() {
      return this.$store.state.author.pages.count;
    },
    error() {
      return this.$store.state.author.pages.error;
    },
    from() {
      return this.offset + 1;
    },
    loading() {
      return this.$wait.is('author.pages.load');
    },
    pages() {
      return this.$store.state.author.pages.cache[this.offset];
    },
    to() {
      return Math.min(this.offset + this.limit, this.count);
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
      await this.$store.dispatch('author/pages/load', {
        ...params,
        limit: this.limit
      });
    },
    async readPage(offset) {
      await this.fetchData({
        application: this.filter.application,
        sort: this.filter.sort,
        offset: offset
      });
      this.offset = offset;
    },
    submitFilter() {
      this.action = 'filter';
      this.offset = 0;
      this.fetchData({
        application: this.filter.application,
        sort: this.filter.sort,
        offset: this.offset,
        reload: true
      });
    },
    resetFilter() {
      this.action = 'reset';
      this.$formulate.reset('filterForm');
      this.offset = 0;
      this.fetchData({
        application: this.filter.application,
        sort: this.filter.sort,
        offset: this.offset,
        reload: true
      });
    }
  }
};
</script>
