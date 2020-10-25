<template>
  <Header
    v-if="application"
    :title="$t('news')"
    :subtitle="application.name"
    :picture="picture"
    :toolbar="toolbar"
  >
    <div v-html="application.description"></div>
  </Header>
</template>

<script>
import Story from '@/models/Story';
import messages from './lang';
import Header from '@/components/Header';
/**
 * Component for header of category page
 */
export default {
  components: {
    Header
  },
  i18n: messages,
  computed: {
    application() {
      /* eslint-disable max-len */
      if (this.$route.params.application) {
        return this.$store.getters['applications/application'](this.$route.params.application);
      }
      return null;
      /* eslint-enable max-len */
    },
    picture() {
      if (this.application && this.application.images) {
        return this.application.images.normal;
      }
      return null;
    },
    toolbar() {
      const buttons = [];
      if (this.$can('create', Story.type())) {
        buttons.push({
          icon: 'fas fa-plus',
          route: {
            name: 'author.news.create'
          }
        });
      }
      return buttons;
    }
  }
};
</script>
