<template>
  <IconCard :to="linkToCategory" :title="category.title">
    <template v-if="category.icon_picture" slot="icon">
        <div class="text-red-700 inline-block">
          <inline-svg
            :src="category.icon_picture"
            width="42"
            height="32"
            fill="#c61c18"
          />
        </div>
    </template>
    <template slot="text">
      {{ category.short_description }}
    </template>
  </IconCard>
</template>

<script>
import InlineSvg from 'vue-inline-svg';
import IconCard from '@/components/IconCard.vue';

/**
 * Component that show a category Card
 */
export default {
  components: {
    InlineSvg,
    IconCard
  },
  props: {
    /**
     * The category to show in the card.
     */
    category: {
      type: Object,
      required: true
    }
  },
  computed: {
    linkToCategory() {
      return {
        name: 'categories.read',
        params: {
          id: this.category.id
        }
      };
    }
  }
};
</script>
