<template>
  <h1 class="sm:text-4xl text-3xl mb-4 font-medium">
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
