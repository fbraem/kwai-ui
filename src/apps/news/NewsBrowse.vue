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
        <Spinner v-if="news.load.isRunning" />
        <div
          v-for="story in news.all"
          :key="story.id"
          class="p-2 w-full"
        >
          <NewsCard :story="story" :application="story.application" />
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
      v-if="!news.load.isRunning && news.fullCount === 0"
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
import {useNewsStore} from '@/apps/news/composables/useNews';
import {reactive, onMounted, watch} from '@vue/composition-api';

export default {
  props: {
    app: {
      type: String
    },
    year: {
      type: [Number, String]
    },
    month: {
      type: [Number, String]
    }
  },
  setup(props) {
    const news = useNewsStore();
    const paginator = reactive({
      offset: 0,
      count: 0,
      limit: 10
    });

    onMounted(() => {
      news.load.run({
        application: props.app,
        year: props.year,
        month: props.month
      });
      paginator.count = news.fullCount;
    });

    watch(props, () => {
      readPage(0);
    });

    const readPage = async(offset) => {
      news.load.run({
        offset: offset,
        year: props.year,
        month: props.month,
        application: props.application,
      }, true);
      paginator.offset = offset;
    };

    return {
      news: reactive(news),
      paginator,
      readPage
    };
  },
  i18n: messages,
  components: {
    Page,
    NewsCard,
    Paginator,
    Spinner,
    Alert,
    Sidebar
  }
};
</script>
