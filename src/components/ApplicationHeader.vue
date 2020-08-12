<template>
  <h1 class="leading-7 sm:leading-9 sm:truncate sm:text-4xl text-3xl mb-4 font-medium">
    {{ content }}
  </h1>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    }
  }
};
</script>
