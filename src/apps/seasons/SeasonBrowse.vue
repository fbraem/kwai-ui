<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="flex-1 min-w-0">
          <ApplicationHeader :content="$t('seasons')" />
        </div>
        <div class="mt-5 flex sm:mt-0 sm:ml-4">
          <IconButton v-if="canCreate"
            class="bg-primary text-primary_light"
            icon="fas fa-plus"
            :content="$t('create')"
            :route="{ name: 'seasons.create' }"
          />
        </div>
      </div>
    </PageHeader>
    <PageSection>
      <Spinner
        v-if="isLoading"
        class="mx-auto"
      >
      </Spinner>
      <div v-else
        class="w-full"
      >
        <Alert
          v-if="noSeasons"
          type="warning"
        >
          {{ $t('no_seasons') }}
        </Alert>
        <div v-else class="flex flex-col">
          <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th></th>
                    <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('form.season.name.label') }}
                    </th>
                    <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('period') }}
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <SeasonRow
                    v-for="season in seasons.all"
                    :key="season.id"
                    :season="season"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  </div>
</template>

<script>
import messages from './lang';

import Spinner from '@/components/Spinner.vue';
import Alert from '@/components/Alert.vue';
import SeasonRow from './TheSeasonRow.vue';
import PageSection from '@/components/PageSection.vue';
import Season from '@/models/Season';
import PageHeader from '@/components/PageHeader.vue';
import IconButton from '@/components/IconButton.vue';
import ApplicationHeader from '@/components/ApplicationHeader.vue';
import {useSeasonStore} from '@/apps/seasons/composables/useSeasons';
import {reactive} from '@vue/composition-api';

export default {
  setup() {
    return {
      seasons: reactive(useSeasonStore())
    };
  },
  i18n: messages,
  components: {
    ApplicationHeader,
    IconButton,
    PageHeader,
    Spinner,
    SeasonRow,
    Alert,
    PageSection
  },
  computed: {
    canCreate() {
      return this.$can('create', Season.type());
    },
    noSeasons() {
      return this.seasons.count === 0;
    },
    isLoading() {
      return this.seasons.load.isRunning;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      await vm.seasons.load.run();
      next();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    // await this.seasons.load();
    await this.seasons.load.run();
    next();
  }
};
</script>
