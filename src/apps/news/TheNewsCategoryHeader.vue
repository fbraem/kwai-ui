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
import Header from '@/components/Header.vue';
import useApplications from '@/site/composables/useApplications';
import {computed} from '@vue/composition-api';
/**
 * Component for header of category page
 */
export default {
  props: {
    app: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const applicationStore = useApplications();

    const application = computed(() => {
      if (applicationStore.all.value) {
        return applicationStore.all.value.find(a => a.id === props.app);
      }
      return null;
    });

    return {
      application
    };
  },
  components: {
    Header
  },
  i18n: messages,
  computed: {
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
