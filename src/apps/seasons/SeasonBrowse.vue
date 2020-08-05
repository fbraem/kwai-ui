<template>
  <div class="container mx-auto mt-3">
    <Spinner v-if="seasons.isLoading">
    </Spinner>
    <div v-else>
      <Alert
        v-if="seasons.count === 0"
        type="warning"
      >
        {{ $t('no_seasons') }}
      </Alert>
      <table
          v-else
          class="table"
      >
        <thead>
          <tr>
            <th></th>
            <th>
              {{ $t('form.season.name.label') }}
            </th>
            <th>
              {{ $t('period') }}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <SeasonRow
            v-for="season in seasons.all"
            :key="season.id"
            :season="season"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import messages from './lang';

import Spinner from '@/components/Spinner';
import Alert from '@/components/Alert';
import SeasonRow from './TheSeasonRow';

export default {
  props: [ 'seasons' ],
  i18n: messages,
  components: {
    Spinner,
    SeasonRow,
    Alert
  },
  computed: {
    noSeasons() {
      return this.seasons && this.seasons.length === 0;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      await vm.seasons.load();
      next();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await this.seasons.load();
    next();
  }
};
</script>
