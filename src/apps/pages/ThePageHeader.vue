<template>
  <component
    :is="header"
    v-if="page"
    :title="page.content.title"
    :toolbar="toolbar"
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
        :to="categoryLink"
        class="font-bold"
      >
        {{ page.category.name }}
      </router-link>
    </p>
    <div v-html="page.content.html_summary">
    </div>
    <AreYouSure
      :show="isModalVisible"
      :yes="$t('delete')"
      :no="$t('cancel')"
      @sure="deletePage"
      @close="close"
    >
      {{ $t('are_you_sure') }}
    </AreYouSure>
  </component>
</template>

<script>
import messages from './lang';

import AreYouSure from '@/components/AreYouSure.vue';
import Header from '@/components/Header.vue';
import ImageHeader from '@/components/ImageHeader.vue';

/**
 * Component for a page header
 */
export default {
  i18n: messages,
  components: {
    AreYouSure,
    Header,
    ImageHeader
  },
  data() {
    return {
      isModalVisible: false
    };
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
    categoryLink() {
      return {
        name: 'categories.read',
        params: {
          id: this.page.category.id
        }
      };
    },
    toolbar() {
      const buttons = [];
      if (this.page) {
        if (this.$can('update', this.page)) {
          buttons.push({
            icon: 'fas fa-edit',
            route: {
              name: 'pages.update',
              params: {
                id: this.page.id
              }
            }
          });
          if (this.$can('delete', this.page)) {
            buttons.push({
              icon: 'fas fa-trash',
              method: this.showModal
            });
          }
        }
      }
      return buttons;
    }
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    close() {
      this.isModalVisible = false;
    },
    deletePage() {
      this.isModalVisible = false;
      console.log('delete');
    }
  }
};
</script>
