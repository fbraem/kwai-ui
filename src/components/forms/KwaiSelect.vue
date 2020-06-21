<template>
  <!-- eslint-disable max-len -->
  <select
    :value="value"
    :id="id"
    class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 leading-thight rounded focus:outline-none focus:shadow-outline focus:border-gray-500"
    :class="{ 'border-red-600' : !valid }"
    :required="required"
    v-bind="$attrs"
    @input="$emit('input', $event.target.value)"
  >
    <option value="" v-if="empty">{{ empty }}</option>
    <option v-for="(item, index) in items" :value="item.value" :key="index">
      {{ item.text }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      required: true
    },
    valid: {
      type: Boolean,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    items: {
      required: true
    },
    empty: {
      type: String,
      default: ''
    }
  }
};
</script>
