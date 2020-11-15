<template>
  <div>
    <Hero class="bg-hero text-hero_light">
      <template slot="left">
        <img
          class="object-cover object-center rounded mx-auto"
          alt="avatar"
          :src="require('@/apps/author/images/no_avatar.png')"
        >
      </template>
      <ApplicationHeader :content="$t('title')" />
      <p class="mb-8 leading-relaxed">
        {{ $t('intro') }}
      </p>
      <div class="items-center flex sm:flex-row flex-col">
        <IconButton
          class="bg-primary hover:bg-primary_dark text-primary_light m-2"
          icon="fas fa-newspaper"
          :content="$t('manage_news')"
          :route="{ name: 'author.news' }"
        />
        <IconButton
          class="bg-primary hover:bg-primary_dark text-primary_light m-2"
          icon="fas fa-file-alt"
          :content="$t('manage_articles')"
          :route="{ name: 'author.pages' }"
        />
      </div>
    </Hero>
    <router-view></router-view>
  </div>
</template>

<style scoped>
</style>

<script>
import lang from './lang';

import Hero from '@/components/Hero.vue';
import IconButton from '@/components/IconButton.vue';
import ApplicationHeader from '@/components/ApplicationHeader.vue';
import {provideAuthorNewsStore} from '@/apps/author/composables/useNews';
import {provideAuthorPageStore} from '@/apps/author/composables/usePages';

export default {
  setup() {
    provideAuthorNewsStore();
    provideAuthorPageStore();
  },
  components: {
    Hero,
    IconButton,
    ApplicationHeader
  },
  i18n: lang
};
</script>
