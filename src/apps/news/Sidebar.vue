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
              <span
                class="badge bg-red-700 text-red-300"
                style="float:right"
              >
                {{ month.count }}
              </span>
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

export default {
  components: {
    HeaderLine,
    CoverLink
  },
  i18n: messages,
  computed: {
    categories() {
      return this.$store.state.category.all;
    },
    archiveYears() {
      var archive = this.$store.state.news.archive;
      var sorted = Object.keys(archive).reverse();
      return sorted;
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
