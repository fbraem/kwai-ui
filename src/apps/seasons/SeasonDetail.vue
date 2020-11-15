<template>
  <div
    v-if="season"
    class="flex flex-col"
  >
    <Attributes
      :title="$t('season')"
      :description="season.name"
      :attributes="attributes"
    />
    <Alert v-if="season.active" :icon="false">
      <i class="fas fa-check"></i>
      &nbsp;&nbsp;{{ $t('active_message') }}
    </Alert>
  </div>
</template>

<script>
import messages from './lang';

import Attributes from '@/components/Attributes.vue';
import Alert from '@/components/Alert.vue';

export default {
  props: {
    season: {
      required: true
    }
  },
  components: {
    Attributes, Alert
  },
  i18n: messages,
  computed: {
    attributes() {
      return {
        start_date: {
          label: this.$t('form.season.start_date.label'),
          value: this.season.formatted_start_date
        },
        end_date: {
          label: this.$t('form.season.end_date.label'),
          value: this.season.formatted_end_date
        },
        remark: {
          label: this.$t('form.season.remark.label'),
          value: this.season.remark
        }
      };
    }
  }
};
</script>
