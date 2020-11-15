<template>
  <!-- eslint-disable max-len -->
  <div class="h-screen w-full max-w-sm mx-auto flex justify-center items-center">
    <div>
      <DialogTitle>
        <slot name="title"></slot>
      </DialogTitle>
      <div class="border-red-700 p-8 border-t-8 bg-white mb-6 rounded-lg shadow-lg">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import DialogTitle from './DialogTitle.vue';

export default {
  components: {
    DialogTitle
  }
};
</script>
