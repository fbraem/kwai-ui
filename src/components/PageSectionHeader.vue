<template>
  <PageSection>
    <h2 class="sm:text-3xl text-2xl text-gray-900 font-medium mb-2 md:w-2/5">
      {{ title }}
    </h2>
    <div class="md:w-3/5 md:pl-6">
      <slot></slot>
    </div>
  </PageSection>
</template>

<style scoped>
</style>

<script>
import PageSection from '@/components/PageSection';

export default {
  components: {
    PageSection,
  },
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>
