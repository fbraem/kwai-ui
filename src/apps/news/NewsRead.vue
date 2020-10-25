<template>
  <Page>
    <Spinner v-if="$wait.is('news.read')" />
    <article
      v-if="story"
      class="markdown container mx-auto"
    >
      <h1 class="hidden lg:block">{{ story.content.title }}</h1>
      <blockquote>
        <div v-html="story.content.html_summary"></div>
      </blockquote>
      <div
        class="news-content"
        v-html="story.content.html_content"
      >
      </div>
      <!-- used to copy the url to the clipboard -->
      <input id="cb" type="text" hidden>
      <button class="red-button" @click="copyText(facebookUrl)">
        <i class="fab fa-facebook-f mr-2"></i> Deel
      </button>
    </article>
    <template slot="sidebar">
      <Sidebar />
    </template>
    <notifications position="bottom right" />
  </Page>
</template>

<style>
.news-content .gallery {
    background: #eee;
    column-count: 1;
    column-gap: 1em;
    padding-left: 1em;
    padding-top: 1em;
    padding-right: 1em;
}

@screen lg {
  .news-content .gallery {
    column-count: 2;
  }
}
@screen xl {
  .news-content .gallery {
      column-count: 4;
  }
}

.news-content .gallery .item {
    background: white;
    display: inline-block;
    margin: 0 0 1em;
    width: 100%;
    padding: 1em;
}
</style>

<script>
import messages from './lang';
import config from 'config';
import Page from '@/components/Page';
import Sidebar from './Sidebar';
import Spinner from '@/components/Spinner';
import {useNewsStore} from '@/apps/news/composables/useNews';
import {reactive, computed, watch, onMounted, getCurrentInstance} from '@vue/composition-api';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const news = useNewsStore();

    onMounted(() => {
      news.read.run(props.id);
    });
    watch(() => props.id, (newValue) => {
      news.read.run(newValue);
    });

    const story = computed(() => {
      return news.current;
    });

    const facebookUrl = computed(() => {
      if (story.value) {
        return config.site + '/facebook/news/' + story.value.id;
      }
    });

    const vm = getCurrentInstance();
    const copyText = (text) => {
      const cb = document.getElementById('cb');
      cb.value = text;
      cb.style.display = 'block';
      cb.select();
      document.execCommand('copy');
      cb.style.display = 'none';
      vm.$notify({
        title: 'Link Gekopieerd!',
        text: 'De link om te delen op Facebook is in de clipboard geplaatst!',
        duration: 10000
      });
    };

    return {
      news: reactive(news),
      story,
      facebookUrl,
      copyText
    };
  },
  components: {
    Page,
    Sidebar,
    Spinner
  },
  i18n: messages
};
</script>
