<template>
  <!-- eslint-disable max-len -->
  <span class="mx-2 py-1 px-2 rounded-lg leading-none inline-flex items-center text-xs font-bold">
    {{ content }}
  </span>
</template>

<script>
export default {
  props: {
    content: {
      type: String
    }
  }
};
</script>
