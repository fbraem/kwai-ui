<template>
  <div class="flex flex-col">
    <div>
      <h3 class="header-line">
        {{ $t('overview') }}
      </h3>
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
    ApplicationListItem
  },
  i18n: messages
};
</script>
