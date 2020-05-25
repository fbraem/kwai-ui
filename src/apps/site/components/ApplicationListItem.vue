<template>
  <li class="mb-4">
    <div class="flex flex-no-wrap relative items-center">
      <router-link
        :to="linkToApplication"
        class="cover"
      />
      <div
        v-if="icon"
        class="mr-3 text-red-700"
        style="width: 40px"
      >
        <inline-svg
          :src="icon"
          width="40"
          height="40"
          fill="#c61c18"
        />
      </div>
      <div>
        <h4 class="mb-0">
          {{ application.name }}
        </h4>
        <div class="text-sm">
          {{ application.short_description }}
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import InlineSvg from 'vue-inline-svg';

import Category from '@/models/Category';
import Application from '@/models/Application';

/**
 * Component for showing an application in the list of applications
 */
export default {
  components: {
    InlineSvg
  },
  props: {
    /**
     * The category
     */
    application: {
      type: Application,
      required: true
    },
    icon: {
      type: String,
      required: false
    }
  },
  computed: {
    linkToApplication() {
      return {
        name: 'categories.read',
        params: {
          id: this.application.id
        }
      };
    }
  }
};
</script>
