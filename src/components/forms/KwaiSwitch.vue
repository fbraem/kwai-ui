<!-- Based on https://codepen.io/lhermann/pen/EBGZRZ -->
<template>
  <!-- eslint-disable max-len -->
  <div>
    <label
      :for="id"
      class="flex items-center cursor-pointer"
    >
      <div class="relative">
        <input
          :value="value"
          :id="id"
          type="checkbox"
          class="hidden"
          @change="$emit('input', $event.target.checked)"
          :checked="value"
        />
        <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner">
        </div>
        <div class="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0">
        </div>
      </div>
      <div class="ml-3">
        <slot></slot>
      </div>
    </label>
  </div>
</template>

<style scoped>
.toggle__dot {
  top: -.25rem;
  left: -.25rem;
  transition: all 0.3s ease-in-out;
}

input:checked ~ .toggle__dot {
  transform: translateX(100%);
  background-color: #48bb78;
}
</style>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      required: true
    }
  }
};
</script>
