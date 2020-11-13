<template>
  <div>
    <ImageHeader
      v-if="application"
      :title="application.title"
      :toolbar="toolbar"
      :picture="picture"
      :pictures="pictures"
    >
      <div v-html="application.description">
      </div>
    </ImageHeader>
    <div class="container mx-auto flex flex-col p-3">
      <div class="block">
        <HeaderLine tag="h4" :content="$t('featured_news')" />
        <Spinner v-if="newsStore.load.isRunning" />
        <div v-if="newsStore.count == 0">
          {{ $t('no_featured_news') }}
        </div>
        <div v-else>
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
          {{ $t('more_news') }}
        </router-link>
      </div>
      <Spinner v-if="pageStore.load.isRunning" />
      <div
        class="block"
        v-if="pageStore.count > 0"
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
import useApplications from '@/site/composables/useApplications';
import {onMounted, computed, reactive, watch} from '@vue/composition-api';
import {useNewsStore} from '@/apps/news/composables/useNews';
import {usePageStore} from '@/apps/pages/composables/usePages';
import ImageHeader from '@/components/ImageHeader';

/**
 * Page for showing category news and information
 */
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const applicationStore = useApplications();

    const application = computed(() => {
      if (applicationStore.all.value) {
        return applicationStore.all.value.find(a => a.id === props.id);
      }
      return null;
    });

    const newsStore = useNewsStore();
    const pageStore = usePageStore();
    if (application.value) {
      onMounted(() => {
        newsStore.load.run({
          promoted: true,
          application: application.value.id
        }, true);
        pageStore.load.run({application: application.value.id}, true);
      });
    }

    watch(
      () => application.value,
      () => {
        newsStore.load.run({
          promoted: true,
          application: application.value.id
        }, true);
        pageStore.load.run({
          application: application.value.id,
        }, true);
      }
    );

    return {
      newsStore: reactive(newsStore),
      pageStore: reactive(pageStore),
      application
    };
  },
  i18n: messages,
  components: {
    ImageHeader,
    HeaderLine,
    NewsSlider,
    PageSummary,
    Spinner
  },
  computed: {
    moreNewsLink() {
      return {
        name: 'news.application',
        params: {
          app: this.application.id
        }
      };
    },
    picture() {
      return this.application?.header_picture;
    },
    pictures() {
      if (this.application?.header_images
        && Object.keys(this.application.header_images).length > 0) {
        return {
          '1024w': this.application.header_images.lg,
          '768w': this.application.header_images.md,
          '640w': this.application.header_images.sm,
        };
      }
      return null;
    },
    toolbar() {
      const buttons = [];
      if (this.$can('update', this.application)) {
        buttons.push({
          icon: 'fas fa-edit',
          route: {
            name: 'categories.update',
            params: {
              id: this.application.id
            }
          }
        });
      }
      return buttons;
    }
  }
};
</script>
