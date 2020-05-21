<template>
  <div v-html="headerHtml">
  </div>
</template>

<script>
export default {
  data() {
    return {
      headerHtml: this.$route.meta.html['./header.html']
    };
  },
};
</script>
