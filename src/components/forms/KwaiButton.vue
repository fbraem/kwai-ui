<template>
  <button
    class="red-button disabled:opacity-50 disabled:cursor-not-allowed"
    :disabled="disabled"
    :type="type"
  >
    <i
      v-if="icon"
      class="mr-2"
      :class="icon"
    >
    </i>
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    type: {
      type: String,
      default: 'button'
    }
  }
};
</script>
