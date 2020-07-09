<!-- This template will receive the App component from the active app -->
<template>
  <div>
    <Toolbar></Toolbar>
    <div class="bg-gray-100">
      <router-view></router-view>
    </div>
    <div v-if="footer" v-html="footer">
    </div>
  </div>
</template>

<script>
import Toolbar from '@/site/Toolbar';
let html = {};
const importAllHtml
  = requireContext => requireContext.keys().forEach(
    key => (html[key] = requireContext(key))
  )
;
importAllHtml(require.context('custom', false, /.html$/));

export default {
  components: {
    Toolbar
  },
  data() {
    return {
      footer: html['./footer.html']
    };
  },
  beforeCreate() {
    this.$store.dispatch('applications/load');
  },
  beforeDestroy() {
  }
};
</script>
