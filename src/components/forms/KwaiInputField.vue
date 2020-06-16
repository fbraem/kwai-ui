<!--suppress HtmlFormInputWithoutLabel -->
<template>
  <!-- eslint-disable max-len -->
  <input
    :value="value"
    :id="id"
    class="appearance-once block w-full bg-gray-200 border rounded py-3 px-4 mb-3 leading-thight focus:outline-none focus:shadow-outline"
    :class="{ 'border-red-600' : !valid }"
    :type="type"
    :required="required"
    v-bind="$attrs"
    @input="$emit('input', $event.target.value)"
  />
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
    type: {
      type: String,
      default: 'text'
    }
  }
};
</script>
