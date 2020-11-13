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
import ImageHeader from '@/components/ImageHeader';

export default {
  components: {
    ImageHeader
  },
  i18n: messages,
  data() {
    return {
      pictures: {
        '1024w': require('custom/news/images/exclamation_lg.jpg'),
        '768w': require('custom/news/images/exclamation_md.jpg'),
        '640w': require('custom/news/images/exclamation_sm.jpg')
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
