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
        <Spinner v-if="newsStore.load.isRunning" />
        <div v-if="newsStore.fullCount === 0">
          Momenteel is er geen belangrijk nieuws
        </div>
        <div v-if="newsStore.all.length > 0">
          <NewsSlider :stories="newsStore.all" />
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
      <Spinner v-if="pageStore.load.isRunning" />
      <div
        class="block"
        v-if="pageStore.fullCount > 0"
      >
        <HeaderLine tag="h4" content="Informatie" />
        <div class="flex flex-wrap">
          <div
            v-for="page in pageStore.all"
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
import HeaderLine from '@/components/HeaderLine';
import NewsSlider from '@/apps/news/components/NewsSlider';
import PageSummary from '@/apps/pages/components/PageSummary';
import ImageHeader from '@/components/ImageHeader';
import Spinner from '@/components/Spinner';
import useApplications from '@/site/composables/useApplications';
// eslint-disable-next-line max-len
import {providePageStore, usePageStore} from '@/apps/pages/composables/usePages';
import {watch, reactive, computed, onMounted} from '@vue/composition-api';
import {provideNewsStore, useNewsStore} from '@/apps/news/composables/useNews';

export default {
  setup() {
    const applicationStore = useApplications();

    const application = computed(() => {
      if (applicationStore.all.value) {
        return applicationStore.all.value.find(a => a.name === 'tournaments');
      }
      return null;
    });

    provideNewsStore();
    const newsStore = useNewsStore();
    providePageStore();
    const pageStore = usePageStore();

    if (application.value) {
      onMounted(() => {
        newsStore.load.run({
          promoted: true,
          application: application.value.id
        });
        pageStore.load.run({application: application.value.id});
      });
    }

    watch(
      () => application.value,
      () => {
        newsStore.load.run({
          promoted: true,
          application: application.value.id
        });
        pageStore.load.run({
          application: application.value.id
        });
      }
    );

    const pictures = reactive({
      '1024w': require('custom/tournaments/images/header_lg.jpg'),
      '768w': require('custom/tournaments/images/header_md.jpg'),
      '640w': require('custom/tournaments/images/header_sm.jpg'),
    });

    const moreNewsLink = computed(() => {
      return {
        name: 'news.application',
        params: {
          application: application.value.id
        }
      };
    });

    return {
      newsStore: reactive(newsStore),
      pageStore: reactive(pageStore),
      application,
      pictures,
      moreNewsLink
    };
  },
  components: {
    ImageHeader,
    HeaderLine,
    NewsSlider,
    PageSummary,
    Spinner
  }
};
</script>
