<template>
  <!-- eslint-disable max-len -->
  <div class="w-full shadow overflow-hidden sm:rounded-lg">
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <slot name="title">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ title }}
        </h3>
      </slot>
      <slot name="description">
        <p
          v-if="description"
          class="mt-1 max-w-2xl text-sm leading-5 text-gray-500"
        >
        {{ description }}
        </p>
      </slot>
    </div>
    <div>
      <dl>
        <div
          v-for="(attribute, name, index) in attributes"
          :key="name"
          class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          :class="{ 'bg-gray-50' : index % 2 === 0, 'bg-white': index % 2 === 1 }"
        >
          <dt class="text-sm leading-5 font-medium">
            <slot name="label" :prop="name" :attribute="attribute">
              {{ attribute.label }}
            </slot>
          </dt>
          <dd class="mt-1 text-sm leading-5 text-gray-700 sm:mt-0 sm:col-span-2">
            <slot :name="'value_' + name" :attribute="attribute">
              {{ attribute.value }}
            </slot>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    attributes: {
      required: true,
      type: Object
    }
  }
};
</script>
