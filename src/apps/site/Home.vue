<template>
  <!-- eslint-disable max-len -->
  <div class="p-4">
    <div class="hidden sm:block container mx-auto bg-gray-100 mb-4">
      <div class="flex flex-row flex-wrap justify-center p-4">
        <div class="w-full sm:w-1/2 md:w-1/4">
          <IconCard :to="{ name : 'news.browse' }" title="Nieuws">
            <template slot="icon">
              <span class="text-red-700">
                <i class="fas fa-newspaper fa-2x"></i>
              </span>
            </template>
            <template slot="text">
              Blijf op de hoogte over het reilen en zeilen van onze club.
            </template>
          </IconCard>
        </div>
        <div class="w-full sm:w-1/2 md:w-1/4">
          <IconCard
            to="https://www.judokwaikemzeke.be/oud/kalender.htm"
            title="Kalender"
          >
            <template slot="icon">
              <span class="text-red-700">
                <i class="fas fa-calendar fa-2x"></i>
              </span>
            </template>
            <template slot="text">
              Bekijk onze kalender voor activiteiten en tornooien
            </template>
          </IconCard>
        </div>
        <div
          v-for="category in categories"
          :key="category.id"
          class="w-full sm:w-1/2 md:w-1/4"
        >
          <CategoryCard :category="category" />
        </div>
      </div>
    </div>
    <div class="block sm:hidden mb-4">
      <div class="flex flex-wrap justify-center">
        <IconCard
          :to="{ name : 'news.browse' }"
          title="Nieuws"
        >
          <template slot="icon">
            <span class="text-red-700">
              <i
                class="fas fa-newspaper fa-2x h-8"
              >
              </i>
            </span>
          </template>
          <template slot="text">
            Blijf op de hoogte over het reilen en zeilen van onze club.
          </template>
        </IconCard>
        <IconCard
          to="https://www.judokwaikemzeke.be/oud/kalender.htm"
          title="Kalender"
        >
          <template slot="icon">
            <span class="text-red-700">
              <i
                class="fas fa-calendar fa-2x h-8"
              >
              </i>
            </span>
          </template>
          <template slot="text">
            Bekijk onze kalender voor activiteiten en tornooien
          </template>
        </IconCard>
      </div>
      <CategoryList
        v-if="categories"
        :categories="categories"
      />
    </div>
    <div class="container mx-auto">
      <h2 class="header-line">
        Belangrijk Nieuws
      </h2>
      <div class="flex justify-center">
        <Paginator
          :count="storiesPaginator.count"
          :limit="storiesPaginator.limit"
          :offset="storiesPaginator.offset"
          @page="loadStories"
        />
      </div>
      <Spinner v-if="$wait.is('news.browse')"/>
      <div class="flex flex-wrap justify-center mb-4">
        <div
          v-for="story in stories"
          :key="story.id"
          class="p-2 md:p-4 w-full xl:w-1/2"
        >
          <NewsCard :story="story" />
        </div>
      </div>
      <div class="flex justify-center">
        <Paginator
          :count="storiesPaginator.count"
          :limit="storiesPaginator.limit"
          :offset="storiesPaginator.offset"
          @page="loadStories"
        />
      </div>
      <div class="block mb-6">
        <router-link
          class="red-button"
          :to="{ name : 'news.browse' }"
        >
          {{ $t('more_news') }}
        </router-link>
      </div>
    </div>
    <div v-if="footerHtml" v-html="footerHtml">
    </div>
  </div>
</template>

<script>
import NewsCard from '@/apps/news/components/NewsCard.vue';
import Paginator from '@/components/Paginator.vue';
import Spinner from '@/components/Spinner.vue';
import IconCard from '@/components/IconCard.vue';
import CategoryCard from '@/apps/categories/components/CategoryCard.vue';
import CategoryList from '@/apps/categories/components/CategoryList.vue';

import messages from '../../site/lang';

export default {
  i18n: messages,
  components: {
    NewsCard,
    Paginator,
    Spinner,
    IconCard,
    CategoryCard,
    CategoryList
  },
  data() {
    return {
      footerHtml: this.$route.meta.html['./footer.html']
    };
  },
  computed: {
    storiesPaginator() {
      return {
        offset: this.$store.state.site.news.offset,
        count: this.$store.state.site.news.count,
        limit: 10
      }
    },
    storiesOffset() {
      return this.$store.state.site.news.offset;
    },
    stories() {
      return this.$store.getters['site/news/stories'](this.storiesOffset);
    },
    categories() {
      return this.$store.state.category.all;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      await vm.fetchData(to.params);
      next();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await this.fetchData(to.params);
    next();
  },
  methods: {
    async fetchData() {
      await this.loadStories(0);
    },
    async loadStories(offset) {
      try {
        await this.$store.dispatch('site/news/load', {
          offset: offset
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
