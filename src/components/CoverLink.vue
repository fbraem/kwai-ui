<template>
  <span>
    <a
      v-if="isLink"
      :href="to"
      class="absolute inset-0"
    >
    </a>
    <router-link
      v-else
      class="absolute inset-0"
      :to="to"
    ></router-link>
  </span>
</template>

<script>
export default {
  props: {
    to: {
      type: [String, Object],
      required: true
    },
  },
  computed: {
    isLink() {
      return typeof this.to === 'string';
    }
  }
};
</script>
