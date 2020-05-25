<template>
  <IconCard :to="linkToApplication" :title="application.title">
    <template v-if="icon" slot="icon">
        <div class="text-red-700 inline-block">
          <inline-svg
            :src="icon"
            width="42"
            height="32"
            fill="#c61c18"
          />
        </div>
    </template>
    <template slot="text">
      {{ application.short_description }}
    </template>
  </IconCard>
</template>

<script>
import InlineSvg from 'vue-inline-svg';
import IconCard from '@/components/IconCard';

/**
 * Component that shows an application card
 */
export default {
  components: {
    InlineSvg,
    IconCard
  },
  props: {
    /**
     * The application to show in the card.
     */
    application: {
      type: Object,
      required: true
    },
    /**
     * Icon of the application.
     */
    icon: {
      type: String
    }
  },
  computed: {
    linkToApplication() {
      return {
        name: 'categories.read',
        params: {
          id: this.application.id
        }
      };
    }
  }
};
</script>
