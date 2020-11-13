<template>
  <!-- eslint-disable max-len -->
  <div>
    <HeaderLine tag="h3" :content="$t('archive')" />
    <template v-for="(year) in archiveYears">
      <div
        class="mt-2"
        :key="year"
      >
        <h4>{{ year }}</h4>
        <ul>
          <li
            v-for="(month) in archive[year]"
            :key="month.month"
            class="pt-2 last:pb-2"
          >
            <div class="relative flex justify-between">
              <CoverLink :to="{ name : 'news.archive', params : { year : year, month : month.month }}" />
              <div class="text-blue-600 flex-grow">
                {{ month.monthName }} {{ year }}
              </div>
              <div class="flex-none">
                <Badge
                  class="bg-red-700 text-red-300"
                  :content="month.count"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import messages from './lang';
import CoverLink from '@/components/CoverLink';
import HeaderLine from '@/components/HeaderLine';
import Badge from '@/components/Badge';
import {useNewsStore} from '@/apps/news/composables/useNews';
import {reactive, onMounted, computed} from '@vue/composition-api';
import moment from 'moment';

export default {
  setup() {
    const news = useNewsStore();

    onMounted(() => {
      news.loadArchive.run();
    });

    const archive = computed(() => {
      let archive = {};
      news.archive.forEach((element) => {
        if (!archive[element.year]) {
          archive[element.year] = [];
        }
        archive[element.year].push({
          monthName: moment.months()[element.month - 1],
          month: element.month,
          year: element.year,
          count: element.count,
        });
      });
      return archive;
    });

    const archiveYears = computed(() => {
      return Object.keys(archive.value).reverse();
    });

    return {
      news: reactive(news),
      archive,
      archiveYears
    };
  },
  components: {
    Badge,
    HeaderLine,
    CoverLink
  },
  i18n: messages
};
</script>
