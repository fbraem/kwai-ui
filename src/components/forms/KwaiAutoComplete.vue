<template>
  <!-- eslint-disable max-len -->
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <input
      type="text"
      v-model="context.model"
      v-bind="context.attributes"
      autocomplete="no"
      @keydown.enter.prevent="context.model = selection.label"
      @keydown.down.prevent="increment"
      @keydown.up.prevent="decrement"
      @blur="context.blurHandler"
    />
    <ul
      class="autocomplete-results"
      v-if="filteredOptions.length"
    >
      <li
        class="autocomplete-result"
        v-for="(option, index) in filteredOptions" :key="option.value"
        v-text="option.label"
        :data-is-selected="selection && selection.value === option.value"
        @mouseenter="select(index)"
        @click="click"
      >
      </li>
    </ul>
  </div>
</template>

<style>
.autocomplete-results {
  @apply p-0 m-0 overflow-auto;
  border: 1px solid #eeeeee;
  height: 120px;
}

.autocomplete-result {
  @apply text-left cursor-pointer;
  padding: 4px 2px;
}

.autocomplete-result[data-is-selected],
.autocomplete-result:hover {
  background-color: #4AAE9B;
  color: white;
}
</style>

<script>
/* eslint-disable max-len */

import {computed, ref, watch} from '@vue/composition-api';

export default {
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const selectedIndex = ref(0);

    const model = computed(() => props.context.model);
    const filteredOptions = computed(() => {
      if (Array.isArray(props.context.options) && props.context.model) {
        const isAlreadySelected = props.context.options.find(option => option.label === props.context.model);
        if (!isAlreadySelected) {
          return props.context.options
            .filter(option => option.label.toLowerCase().includes(props.context.model.toLowerCase()));
        }
      }
      return [];
    });
    const selection = computed(() => {
      if (filteredOptions.value[selectedIndex.value]) {
        return filteredOptions.value[selectedIndex.value];
      }
      return false;
    });

    function increment() {
      const length = filteredOptions.value.length;
      if (selectedIndex.value + 1 < length) {
        selectedIndex.value++;
      } else {
        selectedIndex.value = 0;
      }
    }

    function decrement() {
      const length = filteredOptions.value.length;
      if (selectedIndex.value - 1 >= 0) {
        selectedIndex.value--;
      } else {
        selectedIndex.value = length - 1;
      }
    }

    function select(index) {
      selectedIndex.value = index;
    }

    function click() {
      props.context.model = selection.value.label;
    }

    watch(model, () => { selectedIndex.value = 0; });

    return {
      selectedIndex,
      model,
      filteredOptions,
      selection,
      increment,
      decrement,
      select,
      click
    };
  }
};
</script>
