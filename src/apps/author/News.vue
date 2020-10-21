<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageSectionHeader :title="$t('news.title')">
      <p class="leading-relaxed text-base">
        {{ $t('news.intro') }}
      </p>
      <div class="flex flex-col md:flex-row w-full md:mt-4 mt-6 md:justify-start justify-center items-center">
        <IconButton
          v-if="canCreate"
          class="bg-primary hover:bg-primary_dark text-primary_light m-2"
          icon="fas fa-file-alt"
          :content="$t('news.create')"
          :route="{ name: 'author.news.create' }"
        />
      </div>
    </PageSectionHeader>
    <PageSection v-if="store.load.error">
      <Alert
        type="danger"
        class="w-full"
      >
        {{ store.load.error.response.status }} - {{ store.load.error.response.statusText }}
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
          <div class="flex flex-wrap items-center">
            <div class="w-full sm:w-auto flex-grow mb-3 md:mb-0">
              <FormulateInput
                type="select"
                name="application"
                :label="$t('news.filter.application.label')"
                :options="applications"
                :help="$t('news.filter.application.help')"
                :placeholder="$t('news.filter.application.placeholder')"
              />
            </div>
            <div class="w-full sm:w-auto sm:pl-4 self-center flex-none">
              <FormulateInput
                type="checkbox"
                name="enabled"
                :label="$t('news.form.enabled.label')"
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
                v-if="action === 'reset' && store.load.isRunning"
                class="fas fa-spinner fa-spin mr-2"
              ></i>
              <i v-else class="fas fa-undo mr-2"></i>Reset
            </FormulateInput>
            <FormulateInput
              type="submit"
              :input-class="['bg-primary', 'hover:bg-primary_dark', 'text-primary_light']"
            >
              <i
                v-if="action === 'filter' && store.load.isRunning"
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
        v-if="paginator.count > paginator.limit"
        class="flex-col sm:flex-row flex-1 flex items-center sm:justify-between"
      >
        <div>
          <p class="text-sm leading-5 text-gray-700 mb-2 sm:mb-0">
            {{ $t('news.showing') }}
            <span class="font-medium">
              {{ from }}
            </span>
            {{ $t('news.to') }}
            <span class="font-medium">
              {{ to }}
            </span>
            {{ $t('news.of') }}
            <span class="font-medium">
              {{ paginator.count }}
            </span>
            {{ $t('news.stories') }}
          </p>
        </div>
        <div>
          <Paginator
            :limit="paginator.limit"
            :offset="paginator.offset"
            :count="paginator.count"
            @page="readPage"
          />
        </div>
      </div>
      <div
        v-for="story in store.all"
        :key="story.id"
        class="py-8 flex flex-wrap md:flex-no-wrap w-full"
      >
        <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
          <h2 class="tracking-widest font-medium mb-0">{{ story.application.title }}</h2>
          <span class="mt-1 text-gray-500 text-sm">{{ story.localPublishDate }}</span>
        </div>
        <div class="md:flex-grow">
          <h2 class="text-2xl font-medium title-font mb-2">{{ story.content.title }}</h2>
          <div class="leading-relaxed" v-html="story.content.html_summary">
          </div>
          <div class="flex justify-between">
            <Link
              class="mt-2"
              :content="$t('news.read_more')"
              :route="{ name: 'news.story', params: { id: story.id }}"
              icon="fas fa-arrow-right"
            />
            <Link
              v-if="$can('update', story)"
              class="mt-2"
              :content="$t('news.edit')"
              :route="{ name: 'author.news.update', params: { id: story.id }}"
              icon="fas fa-edit"
            />
          </div>
        </div>
      </div>
    </PageSection>
  </div>
</template>

<style scoped>
</style>

<script>
import PageSection from '@/components/PageSection';
import PageSectionHeader from '@/components/PageSectionHeader';
import IconButton from '@/components/IconButton';

import lang from './lang';
import Link from '@/components/Link';
import Paginator from '@/components/Paginator';
import Alert from '@/components/Alert';

import Story from '@/models/Story';
import {useAuthorNewsStore} from '@/apps/author/composables/useNews';
// eslint-disable-next-line max-len
import {getCurrentInstance, reactive, ref, computed, onMounted} from '@vue/composition-api';

export default {
  setup() {
    const store = useAuthorNewsStore();
    const action = ref('');

    const paginator = reactive({
      offset: 0,
      count: 0,
      limit: 5
    });
    const readPage = async(offset) => {
      await store.load.run({
        offset: offset,
        application: filter.value.application,
        enabled: filter.value.enabled
      }, true);
      paginator.count = store.fullCount;
      paginator.offset = offset;
    };
    onMounted(async() => await readPage(0));

    const filter = ref({
      application: 0,
      enabled: false
    });
    const submitFilter = async() => {
      action.value = 'filter';
      await readPage(0);
    };

    const vm = getCurrentInstance();
    const resetFilter = async() => {
      action.value = 'reset';
      vm.$formulate.reset('filterForm');
      await readPage(0);
    };

    const to = computed(
      () => Math.min(paginator.offset + paginator.limit, paginator.count)
    );

    return {
      store: reactive(store),
      paginator,
      readPage,
      filter,
      resetFilter,
      submitFilter,
      action,
      to
    };
  },
  components: {
    Alert,
    Paginator,
    Link,
    IconButton,
    PageSectionHeader,
    PageSection
  },
  i18n: lang,
  computed: {
    applications() {
      return this.$store.getters['applications/asOptions'](
        (application) => application.news
      );
    },
    canCreate() {
      return this.$can('create', Story);
    },
    from() {
      return this.paginator.offset + 1;
    },
  }
};
</script>
