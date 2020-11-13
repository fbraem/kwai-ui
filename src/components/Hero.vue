<template>
  <!-- eslint-disable max-len -->
  <section>
    <div class="container mx-auto flex px-5 py-12 lg:flex-row flex-col items-center">
      <div class="xl:max-w-lg xl:w-full lg:w-1/2 w-5/6 mb-10 lg:mb-0">
        <slot name="left"></slot>
      </div>
      <div class="xl:flex-grow lg:w-1/2 xl:pl-24 lg:pl-16 flex flex-col lg:items-start lg:text-left items-center text-center">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>

<script>
export default {
};
</script>
