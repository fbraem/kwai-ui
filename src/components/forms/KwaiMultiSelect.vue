<template>
  <div>
    <multiselect
      v-model="context.model"
      :id="context.id"
      :label="context.attributes['multi-label']"
      :options="context.options"
      v-bind="context.attributes"
    >
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

/**
 * Because vue-formulate already uses label as property, we need to use
 * multi-label to set the label of multiselect.
 */
export default {
  props: {
    context: {
      type: Object,
      required: true
    },
  },
  components: {
    Multiselect
  },
};
</script>
