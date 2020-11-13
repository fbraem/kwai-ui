<template>
  <div
    :rules="rules"
    :name="name || label"
    :vid="vid || id"
  >
    <label
      v-if="label"
      class="block font-bold mb-2"
      :class="{ 'text-red-600': errors.length > 0 }"
      :for="id"
    >
      <span>{{ label }}</span>
      <span class="text-sm align-top">{{ required ? ' *': '' }}</span>
    </label>
    <slot :valid="valid || !validated"></slot>
    <div
      v-if="errors[0]"
      class="text-red-600 text-sm italic"
    >
      {{ errors[0] }}
    </div>
  </div>
</template>

<script>

export default {
  props: {
    rules: {
      type: [Object, String],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    vid: {
      type: String,
      default: undefined
    }
  },
};
</script>
