<!--suppress HtmlFormInputWithoutLabel -->
<template>
  <!-- eslint-disable max-len -->
  <textarea
    :value="value"
    :id="id"
    class="appearance-once block w-full bg-gray-200 border rounded py-3 px-4 leading-thight focus:outline-none focus:shadow-outline"
    :class="{ 'border-red-600' : !valid }"
    :required="required"
    v-bind="$attrs"
    @input="$emit('input', $event.target.value)"
  >
  </textarea>
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
    }
  }
};
</script>
