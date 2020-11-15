<template>
  <ImageHeader
    :title="$t('news')"
    :toolbar="toolbar"
    :pictures="pictures"
  >
    <p>
      {{ $t('all_news') }}
    </p>
  </ImageHeader>
</template>

<script>
import Story from '@/models/Story';
import messages from './lang';
import ImageHeader from '@/components/ImageHeader.vue';

import img_lg from 'custom/news/images/exclamation_lg.jpg';
import img_md from 'custom/news/images/exclamation_md.jpg';
import img_sm from 'custom/news/images/exclamation_sm.jpg';
console.log(img_lg);

export default {
  components: {
    ImageHeader
  },
  i18n: messages,
  data() {
    return {
      pictures: {
        '1024w': img_lg,
        '768w': img_md,
        '640w': img_sm
      }
    };
  },
  computed: {
    toolbar() {
      const buttons = [];
      if (this.$can('create', Story.type())) {
        buttons.push({
          icon: 'fas fa-plus',
          route: {
            name: 'author.news.create'
          }
        });
      }
      return buttons;
    }
  }
};
</script>
