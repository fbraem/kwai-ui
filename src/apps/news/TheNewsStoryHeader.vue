<template>
  <!-- eslint-disable max-len -->
  <div class="text-gray-500">
    <div v-if="story && picture">
      <div class="double-color text-gray-500 pb-3">
        <div
          v-if="story"
          class="relative pt-8"
          style="z-index:2;"
        >
          <img
            v-if="picture"
            class="p-3 sm:p-5 shadow-lg bg-gray-300 w-64 sm:w-2/5 lg:w-1/3 xl:w-1/5 mx-auto xl:ml-64"
            :src="picture"
          />
          <div class="container mx-auto flex flex-col mt-3 p-2 text-center xl:-mt-12">
            <h2 class="text-white font-extrabold text-3xl md:text-4xl mb-1">
              {{ $t('news') }}
            </h2>
            <h3 class="text-lg sm:text-xl md:text-2xl mb-0">
              {{ story.content.title }}
            </h3>
            <p class="text-xs sm:text-base text-gray-600">
              {{
                $t('published', {
                  publishDate: story.localPublishDate,
                  publishDateFromNow: story.publishDateFromNow
                })
              }}
              <br />
              Gepubliceerd in
              <router-link
                :to="applicationLink"
                class="font-bold"
              >
                {{ story.application.title }}
              </router-link>
            </p>
            <IconButtons
              v-if="toolbar.length > 0"
              class="self-end"
              :toolbar="toolbar"
              normal-class="text-gray-300"
              hover-class="hover:bg-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-gray-800"
      v-else-if="story"
    >
      <div class="container mx-auto flex flex-col p-2 text-center">
        <h2 class="text-white font-extrabold text-3xl md:text-4xl mb-1">
          {{ $t('news') }}
        </h2>
        <h3 class="text-lg sm:text-xl md:text-2xl mb-0">
          {{ story.content.title }}
        </h3>
        <p class="text-xs sm:text-base text-gray-600">
          {{
            $t('published', {
              publishDate: story.localPublishDate,
              publishDateFromNow: story.publishDateFromNow
            })
          }}
          <br />
          Gepubliceerd in
          <router-link
            :to="applicationLink"
            class="font-bold"
          >
            {{ story.application.title }}
          </router-link>
        </p>
        <IconButtons
          v-if="toolbar.length > 0"
          class="self-end"
          :toolbar="toolbar"
          normal-class="text-gray-300"
          hover-class="hover:bg-gray-900"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.double-color {
  @apply bg-gray-800 w-full relative;
}

.double-color:before {
  content: '';
  @apply bg-gray-300 w-full h-32 absolute inset-0;
  z-index: 1;
}
@screen sm {
  .double-color:before {
    @apply h-48;
  }
};

@screen lg {
  .double-color:before {
    @apply h-56;
  }
};

@screen xl {
  .double-color:before {
    @apply h-64;
  }
};
.red-badge {
  @apply bg-red-700 text-red-300;
}
</style>

<script>
import messages from './lang';

import IconButtons from '@/components/IconButtons.vue';
import {useNewsStore} from '@/apps/news/composables/useNews';
import {reactive, computed} from '@vue/composition-api';

export default {
  setup() {
    const news = useNewsStore();

    const story = computed(() => news.current);
    return {
      news: reactive(news),
      story
    };
  },
  components: {
    IconButtons
  },
  i18n: messages,
  computed: {
    picture() {
      if (this.story) {
        return this.story.overview_picture;
      }
      return null;
    },
    applicationLink() {
      const route = this.$router.resolve({ name: this.story.application.name });
      if (route.resolved.matched.length > 0) {
        return {
          name: this.story.application.name
        };
      } else {
        console.log(
          'No route found for application',
          this.story.application.name
        );
      }
      return null;
    },
    toolbar() {
      const buttons = [];
      if (this.$can('update', this.story)) {
        buttons.push({
          icon: 'fas fa-edit',
          route: {
            name: 'author.news.update',
            params: {
              id: this.story.id
            }
          }
        });
      }
      return buttons;
    }
  }
};
</script>
