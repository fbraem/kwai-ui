<template>
  <!-- eslint-disable max-len -->
  <div class="p-4">
    <div class="hidden sm:block container mx-auto bg-gray-100 mb-4">
      <div
        v-if="applications"
        class="flex flex-row flex-wrap justify-center p-4"
      >
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
    <div
      v-if="applications"
      class="block sm:hidden mb-4"
    >
      <ApplicationList
        :applications="applications"
        :icons="$route.meta.icons"
      />
    </div>
    <div class="container mx-auto">
      <HeaderLine tag="h2" content="Belangrijk Nieuws" />
      <div class="flex justify-center">
        <Paginator
          :count="storiesPaginator.count"
          :limit="storiesPaginator.limit"
          :offset="storiesPaginator.offset"
          @page="loadStories"
        />
      </div>
      <Spinner v-if="newsStore.load.isRunning">
      </Spinner>
      <div class="flex flex-wrap justify-center mb-4">
        <div
          v-for="story in newsStore.all"
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
    <div v-if="aboutHtml" v-html="aboutHtml">
    </div>
  </div>
</template>

<script>
import NewsCard from '@/apps/news/components/NewsCard.vue';
import Paginator from '@/components/Paginator.vue';
import Spinner from '@/components/Spinner.vue';
import ApplicationCard from './components/ApplicationCard.vue';
import ApplicationList from '@/apps/portal/components/ApplicationList.vue';
import HeaderLine from '@/components/HeaderLine.vue';

import messages from '../../site/lang';
import {useApplicationStore} from '@/site/composables/useApplications';
import {computed, onMounted, reactive} from '@vue/composition-api';
import {useNewsStore} from '@/apps/news/composables/useNews';

export default {
  setup() {
    const newsStore = useNewsStore();

    const storiesPaginator = reactive({
      offset: 0,
      count: 0,
      limit: 10
    });
    async function loadStories(offset) {
      await newsStore.load.run({
        offset,
        promoted: true
      });
      storiesPaginator.offset = offset;
    }

    onMounted(async() => {
      await loadStories(0);
      storiesPaginator.count = newsStore.fullCount;
    });

    const applicationStore = useApplicationStore();
    const applications = computed(() => applicationStore.all);

    return {
      applications,
      newsStore: reactive(newsStore),
      loadStories,
      storiesPaginator
    };
  },
  i18n: messages,
  components: {
    HeaderLine,
    NewsCard,
    Paginator,
    Spinner,
    ApplicationCard,
    ApplicationList,
  },
  data() {
    return {
      aboutHtml: this.$route.meta.html['./about.html']
    };
  }
};
</script>
