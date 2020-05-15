<template>
  <!-- eslint-disable max-len -->
  <ImageHeader
    :picture="require('../../site/images/judokwaikemzeke.jpg')"
    :pictures="pictures"
    title="Judokwai Kemzeke"
  >
    <div style="grid-area: hero-text; display: flex; flex-direction: column; justify-content: center;align-items: center">
      <div>
        <img
          :src="require('../../site/images/logo2.png')"
          style="width:121px;height:121px;" />
      </div>
      <div class="text-center">
        {{ $t("message.hello") }}
        {{ $t("message.info") }}
      </div>
    </div>
  </ImageHeader>
</template>

<script>
import messages from '../../site/lang';

import ImageHeader from '@/components/ImageHeader';

export default {
  components: {
    ImageHeader
  },
  i18n: messages,
  data() {
    return {
      pictures: {
        '1024w': require('../../site/images/judokwaikemzeke_lg.jpg'),
        '768w': require('../../site/images/judokwaikemzeke_md.jpg'),
        '640w': require('../../site/images/judokwaikemzeke_sm.jpg')
      }
    };
  },
};
</script>
