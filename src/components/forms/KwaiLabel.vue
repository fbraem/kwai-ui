<template>
  <label
    :for="context.id"
    class="block font-bold mb-2"
    :class="{
      'text-red-600': isError,
      'ml-2': context.classification === 'box'
    }"
  >
    {{ context.label }}
    <sup
      v-if="required"
      class="ml-1 text-sm"
    >
      *
    </sup>
  </label>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isError() {
      return this.context.showValidationErrors;
    }
  }
};
</script>
