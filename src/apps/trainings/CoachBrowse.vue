<template>
  <div>
    <PageHeader>
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="flex-1 min-w-0">
          <ApplicationHeader :content="$t('coaches')" />
        </div>
        <div class="mt-5 flex sm:mt-0 sm:ml-4">
          <IconButton v-if="canCreate"
            class="bg-primary text-primary_light"
            icon="fas fa-plus"
            :content="$t('training.coaches.create')"
            :route="{ name: 'trainings.coaches.create' }"
          />
        </div>
      </div>
    </PageHeader>
    <PageSection>
      <Spinner
        v-if="coaches.load.isRunning"
        class="w-full text-center"
      >
      </Spinner>
      <div
        v-else
        class="w-full"
      >
        <Alert
          v-if="coaches.all.length === 0"
          type="warning"
        >
          {{ $t('training.coaches.no_data') }}
        </Alert>
        <Table v-else>
          <template slot="header">
            <tr>
              <TableHeader>
                {{ $t('name') }}
              </TableHeader>
              <TableHeader>
                {{ $t('training.coaches.form.diploma.label') }}
              </TableHeader>
              <TableHeader>
                {{ $t('training.coaches.form.active.label') }}
              </TableHeader>
              <TableHeader>
              </TableHeader>
            </tr>
          </template>
          <tr
            v-for="coach in coaches.all"
            :key="coach.id"
          >
            <TableCell>
              <router-link :to="{
                  name: 'trainings.coaches.read',
                  params: { id : coach.id}
                }">
                {{ coach.member.person.name }}
              </router-link>
            </TableCell>
            <TableCell>
              {{ coach.diploma }}
            </TableCell>
            <TableCell>
              <i
                v-if="coach.active"
                class="fas fa-check"
              >
              </i>
              <i
                v-else
                class="fas fa-times text-red-500"
              >
              </i>
            </TableCell>
            <TableCell>
              <IconLink
                v-if="$can('update', coach)"
                class="hover:bg-body_dark text-body"
                icon="fas fa-edit"
                :route="{
                  name: 'trainings.coaches.update',
                  params: {
                    id: coach.id
                  }
                }"
              />
            </TableCell>
          </tr>
        </Table>
      </div>
    </PageSection>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue';
import Alert from '@/components/Alert.vue';
import PageHeader from '@/components/PageHeader.vue';
import PageSection from '@/components/PageSection.vue';

import messages from './lang';
import {useCoachStore} from '@/apps/trainings/composables/useCoaches';
// eslint-disable-next-line max-len
import {getCurrentInstance, onMounted, reactive, computed} from '@vue/composition-api';
import Coach from '@/models/trainings/Coach';
import ApplicationHeader from '@/components/ApplicationHeader.vue';
import IconButton from '@/components/IconButton.vue';
import IconLink from '@/components/IconLink.vue';
import Table from '@/components/table/Table.vue';
import TableCell from '@/components/table/TableCell.vue';
import TableHeader from '@/components/table/TableHeader.vue';

export default {
  setup() {
    const vm = getCurrentInstance();
    const coaches = useCoachStore();

    onMounted(async() => {
      await coaches.load.run();
    });

    const canCreate = computed(() => {
      return vm.$can('create', Coach);
    });

    return {
      coaches: reactive(coaches),
      canCreate
    };
  },
  components: {
    IconLink,
    IconButton,
    ApplicationHeader,
    Table,
    TableCell,
    TableHeader,
    Spinner,
    Alert,
    PageHeader,
    PageSection
  },
  i18n: messages,
};
</script>
