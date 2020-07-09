<template>
  <!--
    Based on paginator from tailwindui:
    https://tailwindui.com/components/application-ui/navigation/pagination
  -->
  <!-- eslint-disable max-len -->
  <nav
    v-if="pageCount > 1"
    class="relative z-0 inline-flex shadow-sm"
  >
    <span
      v-if="currentPage === 1"
      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500"
    >
      <i class="fas fa-chevron-left"></i>
    </span>
    <a
      v-else
      @click="triggerPage(currentPage - 1)"
      class="cursor-pointer relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
      aria-label="Previous"
    >
      <i class="fas fa-chevron-left"></i>
    </a>
    <template v-for="(page, index) in pages">
      <span
        v-if="page === '...'"
        :key="index"
        class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700"
      >
        ...
      </span>
      <span
        v-else-if="page === currentPage"
        :key="index"
        class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-bold text-gray-700"
      >
        {{ page }}
      </span>
      <a
        v-else
        :key="index"
        @click="triggerPage(page)"
        class="cursor-pointer -ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
      >
        {{ page }}
      </a>
    </template>
    <span
      v-if="currentPage === pageCount"
      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500"
    >
      <i class="fas fa-chevron-right"></i>
    </span>
    <a
      v-else
      @click="triggerPage(currentPage + 1)"
      class="cursor-pointer -ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
      aria-label="Next"
    >
      <i class="fas fa-chevron-right"></i>
    </a>
  </nav>
</template>

<script>
export default {
  props: {
    limit: Number,
    offset: Number,
    count: Number
  },
  computed: {
    pageCount() {
      return Math.ceil(this.count / this.limit);
    },
    currentPage() {
      let current = 1;
      for (let offset = 0; offset < this.offset; current++) {
        offset += this.limit;
      }
      return current;
    },
    pages() {
      const delta = 2;

      let range = [];
      for (let i = Math.max(2, this.currentPage - delta);
        i <= Math.min(this.pageCount - 1,
          this.currentPage + delta); i++) {
        range.push(i);
      }
      if (this.currentPage - delta > 2) {
        range.unshift('...');
      }
      if (this.currentPage + delta < this.pageCount - 1) {
        range.push('...');
      }

      range.unshift(1);
      range.push(this.pageCount);

      return range;
    }
  },
  methods: {
    triggerPage(newPage) {
      let offset = 0;
      for (let page = 1; page < newPage; page++) {
        offset += this.limit;
      }
      this.$emit('page', offset);
    }
  }
};
</script>
