<template>
  <!-- eslint-disable max-len -->
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <input
      type="text"
      v-model="text"
      v-bind="context.attributes"
      autocomplete="no"
      @keydown.enter.prevent="click"
      @keydown.down.prevent="increment"
      @keydown.up.prevent="decrement"
      @keydown.esc.prevent="reset"
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

    const text = ref('');

    const model = computed(() => props.context.model);
    const filteredOptions = computed(() => {
      if (Array.isArray(props.context.options) && text.value) {
        const isAlreadySelected = props.context.options.find(option => option.label === text.value);
        if (!isAlreadySelected) {
          return props.context.options
            .filter(option => option.label.toLowerCase().includes(text.value.toLowerCase()));
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
      if (selection.value) {
        props.context.model = selection.value;
        text.value = selection.value.label;
      }
    }

    function reset() {
      if (props.context.model) {
        text.value = props.context.model.label;
      }
      selectedIndex.value = 0;
    }

    watch(text, () => {
      selectedIndex.value = 0;
    });

    return {
      selectedIndex,
      model,
      text,
      filteredOptions,
      selection,
      increment,
      decrement,
      select,
      click,
      reset
    };
  }
};
</script>
