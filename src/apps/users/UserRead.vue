<template>
  <div class="container mx-auto mt-6">
    <Spinner v-if="store.read.isRunning" />
    <div v-if="store.read.error">
      <Alert
        v-if="store.read.error.status === 401"
        type="danger"
      >
        {{ $t('not_allowed') }}
      </Alert>
    </div>
    <div
      v-if="user"
      class="flex flex-wrap"
    >
      <div class="w-full sm:w-1/2 p-3">
        <img :src="noAvatarImage"  alt="avatar" />
      </div>
      <div class="w-full sm:w-1/2 flex flex-col p-3">
        <h1>{{ user.name }}</h1>
        <div class="flex flex-wrap justify-between p-3">
          <a class="default-button">
            <i class="fas fa-envelope"></i>Mail
          </a>
          <a class="default-button">
            <i class="fas fa-ban"></i>Block
          </a>
          <router-link
            :to="{ name: 'users.abilities', params: { id: user.id } }"
            class="default-button"
          >
            <i class="fas fa-key"></i>
            {{ $t('rules.title') }}
          </router-link>
        </div>
        <div class="flex flex-wrap justify-around p-3">
          <div>
            <span>
              <i class="fas fa-calendar"></i>
              {{ $t('member_since') }}
            </span>
            <div>
              {{ user.createdAtFormatted }}
            </div>
          </div>
          <div>
            <span>
              <i class="fas fa-user"></i>
              {{ $t('last_login') }}
            </span>
            <div>
              {{ user.lastLoginFormatted }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-full">
        <div>
          <HeaderLine tag="h4" :content="$t('news')" />
          <p class="text-sm">
            {{ $t('news_info') }}
          </p>
          <div
            v-if="newsStore.load.isRunning"
            class="w-full text-center"
          >
            <Spinner />
          </div>
          <div v-if="newsStore.count > 0">
            <ul>
              <li v-for="story in newsStore.all" :key="story.id">
                <router-link
                  :to="{ name: 'news.story', params: { id : story.id } }"
                >
                  {{ story.content.title }}
                </router-link>
              </li>
            </ul>
            <div class="flex justify-center">
              <Paginator
                :count="storiesPaginator.count"
                :limit="storiesPaginator.limit"
                :offset="storiesPaginator.offset"
                @page="loadStories"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="w-full">
        <HeaderLine tag="h4" :content="$t('information')" />
        <p class="text-sm">
          {{ $t('information_info') }}
        </p>
        <Spinner v-if="pageStore.load.isRunning" />
        <div v-if="pageStore.count > 0">
          <ul>
            <li
              v-for="page in pageStore.all"
              :key="page.id"
            >
              <router-link
                :to="{ name: 'pages.read', params: { id : page.id } }"
              >
                {{ page.content.title }}
              </router-link>
            </li>
          </ul>
          <div class="flex justify-center">
            <Paginator
              :count="pagesPaginator.count"
              :limit="pagesPaginator.limit"
              :offset="pagesPaginator.offset"
              @page="loadPages"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import messages from './lang';

import Paginator from '@/components/Paginator';
import Spinner from '@/components/Spinner';
import HeaderLine from '@/components/HeaderLine';
import {useUserStore} from '@/apps/users/composables/useUsers';
import {reactive, onMounted, watch, computed} from '@vue/composition-api';
import Alert from '@/components/Alert';
import {useNewsStore} from '@/apps/users/composables/useNews';
import {usePageStore} from '@/apps/users/composables/usePages';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useUserStore();

    onMounted(async() => {
      await store.read.run(props.id);
    });
    watch(() => props.id, async(newValue) => {
      await store.read.run(newValue);
    });
    const user = computed(() => store.current);

    // TODO: create a composable paginator
    const newsStore = useNewsStore();
    const storiesPaginator = reactive({
      offset: 0,
      count: 0,
      limit: 10
    });
    onMounted(() => {
      loadStories(0);
    });
    watch(() => props.id, () => {
      loadStories(0);
    });

    const loadStories = async(offset) => {
      await newsStore.load.run({
        user: props.id,
        offset
      }, true);
      storiesPaginator.count = newsStore.count;
      storiesPaginator.offset = offset;
    };

    const pageStore = usePageStore();
    const pagesPaginator = reactive({
      offset: 0,
      count: 0,
      limit: 10
    });
    onMounted(() => {
      loadPages(0);
    });
    watch(() => props.id, () => {
      loadPages(0);
    });
    const loadPages = async(offset) => {
      await pageStore.load.run({
        user: props.id,
        offset
      }, true);
      pagesPaginator.count = pageStore.count;
      pagesPaginator.offset = offset;
    };

    return {
      store: reactive(store),
      user,
      newsStore: reactive(newsStore),
      storiesPaginator,
      loadStories,
      pageStore: reactive(pageStore),
      pagesPaginator,
      loadPages
    };
  },
  components: {
    Alert,
    HeaderLine,
    Paginator,
    Spinner
  },
  i18n: messages,
  computed: {
    noAvatarImage() {
      return require('@/apps/users/images/no_avatar.png');
    },
  }
};
</script>
