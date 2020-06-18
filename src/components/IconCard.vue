<template>
  <div class="m-2 p-3 relative h-full hover:shadow text-center">
    <CoverLink :to="to" />
    <div>
      <slot name="icon"></slot>
    </div>
    <div>
      <h4 class="mt-2">
        {{ title }}
      </h4>
    </div>
    <div>
      <slot name="text"></slot>
    </div>
  </div>
</template>

<script>
/**
 * Component that show an icon card
 */
import CoverLink from '@/components/CoverLink';

export default {
  components: {
    CoverLink
  },
  props: {
    title: {
      type: String,
      required: true
    },
    to: {
      type: [ String, Object ]
    }
  }
};
</script>
