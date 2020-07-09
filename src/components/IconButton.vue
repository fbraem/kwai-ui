<template>
  <!-- eslint-disable max-len -->
  <component
    :is="tag"
    class="inline-flex items-center border-0 py-3 px-5 rounded-lg focus:outline-none"
    :[to]="route"
    :[href]="link"
    @[clickEvent]="method"
  >
    <i
      class="mr-4"
      :class="icon"
    ></i>{{ content }}
  </component>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    route: {
      type: Object
    },
    method: {
      type: Function
    },
    link: {
      type: String
    },
  },
  computed: {
    tag() {
      if (this.route) return 'router-link';
      if (this.method) return 'button';
      return 'a';
    },
    clickEvent() {
      if (this.method) return 'click';
      return null;
    },
    to() {
      if (this.route) return 'to';
      return null;
    },
    href() {
      if (this.link) return 'href';
      return null;
    }
  }
};
</script>
