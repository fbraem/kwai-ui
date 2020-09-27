<template>
  <div>
    <PageHeader>
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="flex-1 min-w-0">
          <ApplicationHeader :content="$t('teams')" />
        </div>
        <div class="mt-5 flex sm:mt-0 sm:ml-4">
          <IconButton
            v-if="canCreate"
            class="bg-primary text-primary_light"
            icon="fas fa-plus"
            :content="$t('create_category')"
            :route="{ name: 'team_categories.create' }"
          />
        </div>
      </div>
    </PageHeader>
    <PageSection>
      <Spinner
        v-if="categories.load.isRunning"
        class="w-full text-center"
      >
      </Spinner>
      <Alert
        v-else-if="categories.all.length === 0"
        type="warning"
      >
        {{ $t('no_categories') }}
      </Alert>
      <div
        v-else
        class="w-full">
        <Table>
          <template slot="header">
            <TableHeader>{{ $t('name') }}</TableHeader>
          </template>
          <tr
            v-for="category in categories.all"
            :key="category.id"
            class="p-4 w-full md:w-1/2"
          >
            <TableCell>
              <router-link
                :to="{
                  name: 'team_categories.read',
                  params: {
                    id: category.id
                  }
                }"
              >
                {{ category.name }}
              </router-link>
            </TableCell>
          </tr>
        </Table>
      </div>
    </PageSection>
  </div>
</template>

<script>
import messages from './lang';

import Spinner from '@/components/Spinner';
import Alert from '@/components/Alert';
import Table from '@/components/table/Table';
import TableHeader from '@/components/table/TableHeader';
import TableCell from '@/components/table/TableCell';
import PageHeader from '@/components/PageHeader';
import PageSection from '@/components/PageSection';

import TeamCategory from '@/models/TeamCategory';
// eslint-disable-next-line max-len
import {useTeamCategoryStore} from '@/apps/teams/composables/useTeamCategories';
import {getCurrentInstance, reactive, computed, onMounted} from '@vue/composition-api';
import ApplicationHeader from '@/components/ApplicationHeader';
import IconButton from '@/components/IconButton';

export default {
  setup() {
    const vm = getCurrentInstance();

    const categories = useTeamCategoryStore();

    const canCreate = computed(() => {
      return vm.$can('create', TeamCategory);
    });

    onMounted(() => {
      categories.load.run();
    });

    return {
      categories: reactive(categories),
      canCreate
    };
  },
  i18n: messages,
  components: {
    IconButton,
    ApplicationHeader,
    Spinner,
    Alert,
    Table,
    TableHeader,
    TableCell,
    PageHeader,
    PageSection
  }
};
</script>
