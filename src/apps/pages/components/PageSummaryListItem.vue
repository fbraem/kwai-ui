<template>
  <!-- eslint-disable max-len -->
  <div style="display: flex; flex-direction:column;">
    <div>
      <h4 style="margin-bottom: 0px;">
        {{ page.content.title }}
      </h4>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div class="text-sm truncate">
        {{ page.content.summary }}
      </div>
      <div>
        <router-link
          :to="pageLink"
          class="icon-button text-gray-700 hover:bg-gray-300"
        >
          <i class="fas fa-ellipsis-h"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Page from '@/models/Page';

export default {
  props: {
    page: {
      type: Page,
      required: true
    }
  },
  computed: {
    pageLink() {
      return {
        name: 'pages.read',
        params: {
          id: this.page.id
        }
      };
    }
  }
};
</script>
