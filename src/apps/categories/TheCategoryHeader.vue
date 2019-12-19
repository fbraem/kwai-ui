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

import Category from '@/models/Category';

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
      return this.$store.getters['category/category'](this.$route.params.id);
    },
    picture() {
      if (this.category) return this.category.header_picture;
      return null;
    },
    pictures() {
      return {
        '1024w': this.category.header_images.lg,
        '768w': this.category.header_images.md,
        '640w': this.category.header_images.sm,
      };
    },
    toolbar() {
      const buttons = [];
      if (this.$can('create', Category.type())) {
        buttons.push({
          icon: 'fas fa-plus',
          route: {
            name: 'categories.create'
          }
        });
      }
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
