<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="flex-1 min-w-0">
          <ApplicationHeader :content="$t('training.definitions.title')" />
        </div>
        <div class="mt-5 flex sm:mt-0 sm:ml-4">
          <IconButton
            v-if="canCreate"
            class="bg-primary text-primary_light"
            icon="fas fa-plus"
            :content="$t('training.definitions.create')"
            :route="{ name: 'trainings.definitions.create' }"
          />
        </div>
      </div>
    </PageHeader>
    <PageSection>
      <Spinner
        v-if="definitions.load.isRunning"
        class="w-full text-center"
      ></Spinner>
      <div
        v-else
        class="w-full"
      >
        <Alert
          v-if="definitions.all.length === 0"
          type="warning">
            {{ $t('training.definitions.no_data') }}
        </Alert>
        <Table v-else>
          <template slot="header">
            <tr>
              <TableHeader>
                {{ $t('name') }}
              </TableHeader>
              <TableHeader>
                {{ $t('training.definitions.weekday') }}
              </TableHeader>
              <TableHeader scope="col">
                {{ $t('description') }}
              </TableHeader>
              <TableHeader>
                {{ $t('team') }}
              </TableHeader>
              <TableHeader>
                {{ $t('season') }}
              </TableHeader>
              <TableHeader>
                {{ $t('training.definitions.form.active.label') }}
              </TableHeader>
              <th></th>
            </tr>
          </template>
          <tr
            v-for="definition in definitions.all"
            :key="definition.id"
          >
            <TableCell>
              <router-link
                :to="{
                  name: 'trainings.definitions.read',
                  params: {
                    id : definition.id
                  }
                }"
              >
                {{ definition.name }}
              </router-link>
            </TableCell>
            <TableCell>
              {{ definition.weekdayText }}
            </TableCell>
            <TableCell class="truncate max-w-md">
              {{ definition.description }}
            </TableCell>
            <TableCell>
              <router-link
                v-if="definition.team"
                :to="{
                  name: 'teams.read',
                  params: {
                    id: definition.team.id
                  }
                }"
              >
                {{ definition.team.name }}
              </router-link>
              <div
                v-else
                class="text-center"
              >
                <i class="fas fa-minus"></i>
              </div>
            </TableCell>
            <TableCell>
              <router-link
                v-if="definition.season"
                :to="{
                  name: 'seasons.read',
                  params: {
                    id: definition.season.id
                  }
                }"
              >
                {{ definition.season.name }}
              </router-link>
              <div
                v-else
                class="text-center"
              >
                <i class="fas fa-minus"></i>
              </div>
            </TableCell>
            <TableCell>
              <i
                v-if="definition.active"
                class="fas fa-check"
              >
              </i>
              <i
                v-else
                class="fas fa-times text-red-500"
              >
              </i>
            </TableCell>
            <TableCell class="text-right">
              <router-link
                v-if="$can('update', definition)"
                class="icon-button text-gray-700 hover:bg-gray-300"
                :to="{
                  name: 'trainings.definitions.update',
                    params: {
                      id: definition.id
                    }
                }"
              >
                <i class="fas fa-edit"></i>
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
import TableCell from '@/components/table/TableCell';
import TableHeader from '@/components/table/TableHeader';
import PageSection from '@/components/PageSection';
import PageHeader from '@/components/PageHeader';
import ApplicationHeader from '@/components/ApplicationHeader';
import IconButton from '@/components/IconButton';

import TrainingDefinition from '@/models/trainings/Definition';
import {useDefinitionStore} from '@/apps/trainings/composables/useDefinitions';
// eslint-disable-next-line max-len
import {getCurrentInstance, onMounted, reactive, computed} from '@vue/composition-api';

export default {
  setup() {
    const vm = getCurrentInstance();

    const definitions = useDefinitionStore();

    onMounted(() => {
      definitions.load.run();
    });

    const canCreate = computed(
      () => vm.$can('create', TrainingDefinition)
    );

    return {
      definitions: reactive(definitions),
      canCreate
    };
  },
  components: {
    IconButton,
    ApplicationHeader,
    PageHeader,
    Spinner,
    Alert,
    Table,
    TableCell,
    TableHeader,
    PageSection
  },
  i18n: messages,
};
</script>
