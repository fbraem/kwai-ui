<template>
  <div>
    <PageHeader>
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="flex-1 min-w-0">
          <ApplicationHeader :content="$t('teams')" />
        </div>
        <div class="mt-5 flex sm:mt-0 sm:ml-4">
          <IconButton v-if="canCreate"
            class="bg-primary text-primary_light"
            icon="fas fa-plus"
            :content="$t('create')"
            :route="{ name: 'teams.create' }"
          />
        </div>
      </div>
    </PageHeader>
    <PageSection>
      <Spinner
        v-if="teams.load.isRunning"
        class="w-full text-center"
      ></Spinner>
      <div v-else-if="teams.count === 0">
        {{ $t('no_teams') }}
      </div>
      <div
        v-else
        class="w-full"
      >
        <Table>
          <template slot="header">
            <tr>
              <TableHeader>
                {{ $t('name') }}
              </TableHeader>
              <TableHeader>
                {{ $t('season') }}
              </TableHeader>
              <TableHeader class="text-right">
                {{ $t('members') }}
              </TableHeader>
            </tr>
          </template>
          <tr
            v-for="team in teams.all"
            :key="team.id"
          >
            <TableCell>
              <router-link :to="{ name: 'teams.read', params: { id: team.id } }">
                {{ team.name }}
              </router-link>
            </TableCell>
            <TableCell>
              <router-link
                v-if="team.season"
                :to="{ name: 'seasons.read', params: { id : team.season.id} }"
              >
                {{ team.season.name }}
              </router-link>
            </TableCell>
            <TableCell class="text-right">
              {{ team.members_count }}
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
import Table from '@/components/table/Table';
import TableCell from '@/components/table/TableCell';
import TableHeader from '@/components/table/TableHeader';
import ApplicationHeader from '@/components/ApplicationHeader';
import PageSection from '@/components/PageSection';
import PageHeader from '@/components/PageHeader';
import IconButton from '@/components/IconButton';

import { useTeamStore } from '@/apps/teams/composables/useTeams';
import Team from '@/models/Team';
import {onMounted} from '@vue/composition-api';

export default {
  setup() {
    const teams = useTeamStore();
    onMounted(() => { teams.load.run(); });
    return {
      teams
    };
  },
  i18n: messages,
  components: {
    PageSection,
    PageHeader,
    ApplicationHeader,
    Spinner,
    Table,
    TableHeader,
    TableCell,
    IconButton
  },
  computed: {
    canCreate() {
      return this.$can('create', Team.type());
    }
  }
};
</script>
