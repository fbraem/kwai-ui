<template>
  <component
    :is="tag"
    class="flex w-full justify-center items-center text-center"
  >
    {{ content }}
    <span class="border-t border-solid ml-4 flex-grow flex-shrink-0">
    </span>
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'h1'
    },
    content: {
      type: String
    }
  }
};
</script>
