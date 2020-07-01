<template>
  <!-- eslint-disable max-len -->
  <component
    :is="tag"
    :[to]="route"
    :[href]="link"
    @[clickEvent]="method"
    class="border-none text-base inline-flex justify-center items-center align-middle no-underline rounded-full cursor-pointer focus:outline-none hover:no-underline disabled:opacity-50 disabled:cursor-not-allowed"
    style="width:36px; height: 36px;"
  >
    <i :class="icon"></i>
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
