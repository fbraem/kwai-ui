<template>
  <div class="container mx-auto p-4">
    <router-view
        v-if="season"
        name="season_information"
        :season="season"
    >
    </router-view>
  </div>
</template>

<script>
export default {
  props: [
    'seasons',
  ],
  computed: {
    season() {
      return this.seasons.current;
    },
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      vm.fetchData(to.params);
      next();
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchData(to.params);
    next();
  },
  methods: {
    async fetchData(params) {
      try {
        await this.seasons.read(params.id);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
