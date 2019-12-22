<template>
  <ImageHeader
    :title="$t('training.events.title')"
    :toolbar="toolbar"
    :pictures="pictures"
  >
    {{ description }}
  </ImageHeader>
</template>

<script>
import Training from '@/models/trainings/Training';
import Coach from '@/models/trainings/Coach';
import Team from '@/models/Team';

import ImageHeader from '@/components/ImageHeader';

import messages from './lang';

export default {
  components: {
    ImageHeader
  },
  i18n: messages,
  computed: {
    category() {
      return this.$store.getters['category/categoryApp'](this.$route.meta.app);
    },
    description() {
      return this.category?.description;
    },
    pictures() {
      if (this.category?.header_images) {
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
      if (this.$can('create', Training.type())) {
        buttons.push({
          icon: 'fas fa-calendar-plus',
          route: {
            name: 'trainings.definitions.browse'
          }
        });
        buttons.push({
          icon: 'fas fa-plus',
          route: {
            name: 'trainings.create'
          }
        });
      }
      if (this.$can('manage', Team.type())) {
        buttons.push({
          icon: 'fas fa-users',
          route: {
            name: 'teams.browse'
          }
        });
      }
      if (this.$can('manage', Coach.type())) {
        buttons.push({
          icon: 'fas fa-user-tie',
          route: {
            name: 'trainings.coaches'
          }
        });
      }
      return buttons;
    }
  }
};
</script>
