<template>
  <component
    v-if="page"
    :is="header"
    :title="page.content.title"
    :picture="page.picture"
    :pictures="pictures"
  >
    <p class="text-xs sm:text-base text-gray-600">
      {{
        $t('published', {
          publishDate: page.localPublishDate
        })
      }}
      <span v-if="page.localUpdatedAt">
        &nbsp;|&nbsp;
        {{
          $t('modified', {
            modificationDate: page.localUpdatedAt
          })
        }}
      </span>
      <br />
      Gepubliceerd in
      <router-link
        :to="applicationLink"
        class="font-bold"
      >
        {{ page.application.title }}
      </router-link>
    </p>
    <div v-html="page.content.html_summary">
    </div>
  </component>
</template>

<script>
import messages from './lang';

import Header from '@/components/Header.vue';
import ImageHeader from '@/components/ImageHeader.vue';
import {usePageStore} from '@/apps/pages/composables/usePages';
import {computed, reactive} from '@vue/composition-api';

/**
 * Component for a page header
 */
export default {
  setup() {
    const pageStore = usePageStore();

    const page = computed(() => {
      return pageStore.current;
    });

    return {
      store: reactive(pageStore),
      page
    };
  },
  i18n: messages,
  components: {
    Header,
    ImageHeader
  },
  computed: {
    pictures() {
      const pictures = {};
      if (this.page.images?.crop_lg) {
        pictures['1024w'] = this.page.images.crop_lg;
      }
      if (this.page.images?.crop_md) {
        pictures['768w'] = this.page.images.crop_md;
      }
      if (this.page.images?.crop_sm) {
        pictures['640w'] = this.page.images.crop_sm;
      }
      return pictures;
    },
    header() {
      if (this.picture) return 'ImageHeader';
      return 'Header';
    },
    applicationLink() {
      return {
        name: this.page.application.name
      };
    },
  }
};
</script>
