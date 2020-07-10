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

import store from './store';

import Hero from '@/components/Hero';
import IconButton from '@/components/IconButton';
import ApplicationHeader from '@/components/ApplicationHeader';

export default {
  components: {
    Hero,
    IconButton,
    ApplicationHeader
  },
  i18n: lang,
  beforeCreate() {
    this.$store.registerModule('author', store);
  },
  beforeDestroy() {
    this.$store.dispatch('author/news/reset');
    this.$store.unregisterModule('author');
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.meta.active) {
        vm.$store.dispatch('author/news/setCurrent', to.meta.active);
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'news.story') {
      to.meta.active = this.$store.state.author.news.current;
    }
    next();
  }
};
</script>
