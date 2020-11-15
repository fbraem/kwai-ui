<template>
  <Header
    :title="$t('rules.title')"
    :subtitle="subtitle"
  />
</template>

<script>
import messages from './lang';

import Header from '@/components/Header.vue';
import {computed, getCurrentInstance} from '@vue/composition-api';

export default {
  props: {
    id: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const vm = getCurrentInstance();
    const creating = computed(() => props.id === null);
    const subtitle = computed(() => props.id === null
      ? vm.$t('rules.create') : vm.$t('rules.update')
    );

    return {
      creating,
      subtitle
    };
  },
  i18n: messages,
  components: {
    Header
  },
  computed: {
  }
};
</script>
