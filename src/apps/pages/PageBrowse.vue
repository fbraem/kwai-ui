<template>
  <Page>
    <Spinner v-if="store.load.isRunning" />
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
        v-for="page in store.all"
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
        v-if="! store.load.isRunning && store.fullCount === 0"
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
import Page from '@/components/Page.vue';
import PageSummary from './components/PageSummary.vue';
import Paginator from '@/components/Paginator.vue';
import Spinner from '@/components/Spinner.vue';
import Sidebar from './Sidebar.vue';
import Alert from '@/components/Alert.vue';

import messages from './lang';
import {usePageStore} from '@/apps/pages/composables/usePages';
import {onMounted, reactive, watch} from '@vue/composition-api';

/**
 * Page for browsing information
 */
export default {
  props: {
    application: {
      type: String
    }
  },
  setup(props) {
    const store = usePageStore();
    const paginator = reactive({
      offset: 0,
      count: 0,
      limit: 10
    });

    onMounted(() => {
      readPage(0);
    });
    watch(props, () => {
      readPage(0);
    });

    const readPage = async(offset) => {
      await store.load.run({
        application: props.application,
        offset
      }, true);
      paginator.offset = offset;
      paginator.count = store.fullCount;
    };

    return {
      store: reactive(store),
      readPage
    };
  },
  i18n: messages,
  components: {
    Page,
    Sidebar,
    PageSummary,
    Paginator,
    Spinner,
    Alert
  }
};
</script>
