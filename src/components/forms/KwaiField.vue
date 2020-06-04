<template>
  <div class="flex flex-col">
    <slot name="label">
      <label
        v-if="hasLabel"
        class="block font-bold mb-2"
        :class="{ 'text-red-600' : field.errors.length > 0 }"
        :for="id"
      >
        {{ label }}
        <i
          v-if="field.required"
          class="fas fa-asterisk text-red-700 text-xs align-top">
        </i>
      </label>
    </slot>
    <slot></slot>
    <slot name="error">
      <div
        v-for="(error, index) in field.errors"
        class="text-red-600 text-sm italic"
        :key="index"
      >
        {{ error }}
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    label: {
      type: String
    }
  },
  computed: {
    hasLabel() {
      return this.label && this.label.length > 0;
    }
  },
  provide() {
    return {
      field: this.field,
      id: this.id
    };
  }
};
</script>
