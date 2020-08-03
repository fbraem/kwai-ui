<template>
  <ImageHeader
    v-if="category"
    :title="category.name"
    :toolbar="toolbar"
    :picture="picture"
    :pictures="pictures"
  >
    <div v-html="category.description">
    </div>
  </ImageHeader>
</template>

<script>
import ImageHeader from '@/components/ImageHeader';

import messages from './lang';

/**
 * Component for header of category page
 */
export default {
  components: {
    ImageHeader
  },
  i18n: messages,
  computed: {
    category() {
      return this.$store.getters['applications/application'](this.$route.params.id);
    },
    picture() {
      return this.category?.header_picture;
    },
    pictures() {
      if (this.category?.header_images
        && Object.keys(this.category.header_images).length > 0) {
        return {
          '1024w': this.category.header_images.lg,
          '768w': this.category.header_images.md,
          '640w': this.category.header_images.sm,
        };
      }
      return null;
    },
    toolbar() {
      const buttons = [];
      if (this.$can('update', this.category)) {
        buttons.push({
          icon: 'fas fa-edit',
          route: {
            name: 'categories.update',
            params: {
              id: this.category.id
            }
          }
        });
      }
      return buttons;
    }
  }
};
</script>
