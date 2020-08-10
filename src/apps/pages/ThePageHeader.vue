<template>
  <component
    :is="header"
    v-if="page"
    :title="page.content.title"
    :picture="picture"
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

/**
 * Component for a page header
 */
export default {
  i18n: messages,
  components: {
    Header,
    ImageHeader
  },
  computed: {
    page() {
      return this.$store.state.pages.current;
    },
    picture() {
      return this.page.picture;
    },
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
      let application = this.$store.getters['applications/applicationWithId'](this.page.application.id);
      return {
        name: application.name
      };
    },
  }
};
</script>
