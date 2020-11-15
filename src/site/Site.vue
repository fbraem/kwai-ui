<!-- This template will receive the App component from the active app -->
<template>
  <div id="kwai">
    <Toolbar></Toolbar>
    <div class="bg-gray-100">
      <router-view></router-view>
    </div>
    <div v-if="footer" v-html="footer">
    </div>
    <notifications group="error" />
  </div>
</template>

<script>
import Toolbar from '@/site/Toolbar.vue';
// eslint-disable-next-line max-len
import {provideApplicationStore, useApplicationStore} from '@/site/composables/useApplications';
import {onMounted, reactive} from '@vue/composition-api';

let html = {};

const importAllHtml
  = requireContext => requireContext.keys().forEach(
    key => (html[key] = requireContext(key))
  )
;
importAllHtml(require.context('custom', false, /.html$/));

export default {
  setup() {
    provideApplicationStore();

    const applicationStore = useApplicationStore();
    onMounted(async() => {
      await applicationStore.load.run();
    });

    return {
      store: reactive(applicationStore)
    };
  },
  components: {
    Toolbar
  },
  data() {
    return {
      footer: html['./footer.html']
    };
  }
};
</script>
