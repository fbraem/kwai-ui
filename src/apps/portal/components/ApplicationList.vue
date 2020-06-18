<template>
  <div class="flex flex-col">
    <div>
      <HeaderLine tag="h3" :content="$t('overview')" />
    </div>
    <div>
      <ul class="pl-0">
        <ApplicationListItem
          v-for="(application, index) in applications"
          :application="application"
          :icon="icons[application.name]"
          :key="index"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import messages from '../lang';

import ApplicationListItem from './ApplicationListItem.vue';
import HeaderLine from '@/components/HeaderLine';

/**
 * Component for showing a list of applications
 */
export default {
  /**
   * Applications to show in the list
   */
  props: {
    applications: {
      type: Array,
      required: true
    },
    icons: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    HeaderLine,
    ApplicationListItem
  },
  i18n: messages
};
</script>
