<template>
  <!-- eslint-disable max-len -->
  <tr>
    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
      <i class="fas fa-check" v-if="season.active"></i>
    </td>
    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
      <router-link
        :to="{ name: 'seasons.read', params: { id: season.id} }"
      >
        {{ season.name }}
      </router-link>
    </td>
    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
      <div class="flex flex-col items-center text-sm sm:flex-row sm:justify-between sm:max-w-xs sm:text-base">
        <div>{{ season.formatted_start_date }}</div>
        <div><i class="fas fa-arrows-alt-h"></i></div>
        <div>{{ season.formatted_end_date }}</div>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
      <IconLink
        class="hover:bg-body_dark text-body"
        icon="fas fa-edit"
        :route="{ name: 'seasons.update', params: { id: season.id } }"
      />
    </td>
  </tr>
</template>

<script>
import Season from '@/models/Season';
import IconLink from '@/components/IconLink';

export default {
  components: {IconLink},
  props: {
    season: {
      type: Season,
      required: true
    }
  }
};
</script>
