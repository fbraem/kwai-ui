<template>
  <div class="px-4 pb-6 pt-6 lg:pt-3">
    <div class="flex mb-2">
      <i
        v-if="logo"
        :class="logo"
        class="fa-2x mr-3 fill-current"
      >
      </i>
      <h3 class="font-bold text-xl text-bold mb-0 truncate">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
    </div>
    <slot></slot>
    <div
      v-if="to"
      class="relative flex align-baseline items-center py-3 hover:text-blue-300"
    >
      <CoverLink :to="to" />
      <i class="far fa-arrow-alt-circle-right fa-lg mr-3 fill-current">
      </i>
      <slot name="link">
        <span class="border-b-2 border-blue-300">
          {{ linkTitle }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script>
import CoverLink from '@/components/CoverLink.vue';
export default {
  components: {CoverLink},
  props: {
    title: {
      type: String
    },
    logo: {
      type: String
    },
    to: {
      type: [String, Object]
    },
    linkTitle: {
      type: String,
      default: 'Toon de informatie ...'
    }
  },
  computed: {
    isLink() {
      return typeof this.to === 'string';
    }
  }
};
</script>
