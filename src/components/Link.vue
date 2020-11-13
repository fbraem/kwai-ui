<template>
  <!-- eslint-disable max-len -->
  <component
    :is="tag"
    :[to]="route"
    :[href]="link"
    @[clickEvent]="method"
    class="inline-flex items-center"
  >
    {{ content }}
    <i
      v-if="icon"
      :class="icon"
      class="w-4 h-4 ml-2"
    >
    </i>
  </component>
</template>

<script>
export default {
  props: {
    route: {
      type: Object
    },
    method: {
      type: Function
    },
    link: {
      type: String
    },
    icon: {
      type: String
    },
    content: {
      type: String,
      required: true
    }
  },
  computed: {
    tag() {
      if (this.route) return 'router-link';
      return 'a';
    },
    clickEvent() {
      if (this.method) {
        return 'click';
      }
      return null;
    },
    to() {
      if (this.route) {
        return 'to';
      }
      return null;
    },
    href() {
      if (this.link) return 'href';
      return null;
    }
  }
};
</script>
