<template>
  <!-- eslint-disable max-len -->
  <div>
    <HeaderLine tag="h3" :content="$t('archive')" />
    <template v-for="(year) in archiveYears">
      <div :key="year">
        <h4>{{ year }}</h4>
        <ul>
          <li
            v-for="(month) in archive[year]"
            :key="month.month"
            class="pt-2 last:pb-2"
          >
            <div class="relative">
              <CoverLink :to="{ name : 'news.archive', params : { year : year, month : month.month }}" />
              <span class="text-blue-600">
                {{ month.monthName }} {{ year }}
              </span>
              <Badge
                class="bg-red-700 text-red-300 float-right"
                :content="month.count"
              />
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

export default {
  components: {
    Badge,
    HeaderLine,
    CoverLink
  },
  i18n: messages,
  computed: {
    archiveYears() {
      const archive = this.$store.state.news.archive;
      return Object.keys(archive).reverse();
    },
    archive() {
      return this.$store.state.news.archive;
    }
  },
  created() {
    this.$store.dispatch('news/loadArchive');
  }
};
</script>
