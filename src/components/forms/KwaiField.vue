<template>
  <div>
    <ValidationProvider
      :rules="rules"
      :name="name || label"
      v-slot="{ errors, required, valid, validated }"
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
      <slot :valid="valid || !validated" :required="required">
      </slot>
      <div
        v-if="errors[0]"
        class="text-red-600 text-sm italic"
      >
        {{ errors[0] }}
      </div>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

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
    }
  },

  components: {
    ValidationProvider
  }
};
</script>
