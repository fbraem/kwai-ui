<template>
  <div>
    <Spinner v-if="store.read.isRunning" />
    <article
      v-if="page"
      class="page-content container overflow-x-auto mx-auto p-4"
    >
      <div style="grid-column: 2; justify-self:center">
        <div
          class="mt-4 mx-auto"
          v-html="page.content.html_content">
        </div>
      </div>
    </article>
  </div>
</template>

<style>
.page-content ul, .page-content ul > * {
  @apply list-disc;
}

blockquote {
  background: #f9f9f9;
  border-left: 10px solid #ccc;
  margin: 1.5em 10px;
  padding: 0.5em 10px;
  quotes: "\201C""\201D""\2018""\2019";
}

.page-mini-meta {
    font-size: 12px;
    color: #999;
}

.page-content table {
    border-collapse: collapse;
    margin-bottom:20px;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
}

.page-content table tbody tr:nth-child(odd) {
    background: #eee;
}
.page-content table th,
.page-content table td {
    border: 1px solid black;
    padding: .5em 1em;
}

.page-content blockquote {
  background: #f9f9f9;
  border-left: 10px solid #ccc;
  margin: 1.5em 10px;
  padding: 0.5em 10px;
  quotes: "\201C""\201D""\2018""\2019";
}
.page-content blockquote p {
  display: inline;
}
.page-content h3 {
    font-size: 24px;
    font-weight: 400;
    line-height: 32px;
    letter-spacing: normal;
}
.page-content ul {
    list-style-position: inside;
    margin-bottom: 20px;
}

.page-content .gallery {
    background: #eee;
    column-count: 4;
    column-gap: 1em;
    padding-left: 1em;
    padding-top: 1em;
    padding-right: 1em;
}

.page-content .gallery .item {
    background: white;
    display: inline-block;
    margin: 0 0 1em;
    /*width: 100%;*/
    padding: 1em;
}

.page-content .avatar {
    border-radius:50%;
    width:150px;
    height:150px;
}

@media print
{
    .no-print, .no-print *
    {
        display: none !important;
    }
}
</style>

<script>
import messages from './lang';

import Spinner from '@/components/Spinner.vue';
import {onMounted, reactive, computed} from '@vue/composition-api';
import {usePageStore} from '@/apps/pages/composables/usePages';

/**
 * Page for an information page
 */
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = usePageStore();

    onMounted(() => store.read.run(props.id));
    const page = computed(() => store.current);

    return {
      store: reactive(store),
      page
    };
  },
  components: {
    Spinner,
  },
  i18n: messages
};
</script>
