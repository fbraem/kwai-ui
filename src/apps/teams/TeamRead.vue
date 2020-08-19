<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <div class="flex flex-wrap justify-between">
        <div>
          <ApplicationHeader :content="$t('teams')" />
          <div v-if="team">
            <h2>{{ team.name }}</h2>
          </div>
        </div>
        <div>
          <i
            class="fas fa-bars fa-2x hover:cursor-pointer"
            @click.stop.prevent="showMenu = !showMenu"
          >
          </i>
        </div>
        <div v-if="showMenu">
          <MegaMenu
            class="mega-menu"
            role="toggle"
          >
            <MegaMenuBlock
              class="w-full sm:w-1/2 lg:w-1/4 border-gray-600 border-b sm:border-r lg:border-b-0"
              :to="{ name: 'teams.read', params: { id: team.id }}"
              linkTitle='Toon het team ...'
            >
              <div class="flex justify-center">
                <div class="bg-gray-300 p-3 border-gray-600 border-2">
                  <img
                    class="h-32 w-48"
                    :src="require('./images/team.png')"
                  />
                </div>
              </div>
            </MegaMenuBlock>
            <MegaMenuBlock
              class="w-full sm:w-1/2 lg:w-1/4 border-gray-600 border-b sm:border-r-0 lg:border-r lg:border-b-0"
              :to="{ name: 'team.members', params: { id: team.id }}"
              logo="fas fa-users"
              :title="$t('members')"
              linkTitle="Toon de leden"
            >
              <p class="text-gray-100 text-sm">
                Wie zijn de leden van dit team?
              </p>
            </MegaMenuBlock>
            <MegaMenuBlock
              class="w-full sm:w-1/2 lg:w-1/4 border-gray-600 border-b sm:border-b-0 sm:border-r md:border-b-0"
              title="Tornooien"
              logo="fas fa-trophy"
              :to="{ name: 'team.tournaments', params: { id: team.id }}"
            >
              <p class="text-gray-100 text-sm">
                Welke tornooien zijn er voor dit team georganiseerd?
              </p>
            </MegaMenuBlock>
            <MegaMenuBlock
              class="w-full sm:w-1/2 lg:w-1/4 border-gray-600"
              title="Trainingen"
              logo="fas fa-university"
              :to="{ name: 'team.trainings', params: { id: team.id }}"
            >
              <p class="text-gray-100 text-sm">
                Welke trainingen zijn er voor dit team?
              </p>
            </MegaMenuBlock>
          </MegaMenu>
        </div>
      </div>
    </PageHeader>
    <div class="container mx-auto p-4">
      <router-view name="team_information"></router-view>
      <div class="mt-2 flex flex-row justify-end">
        <IconLink
          class="hover:bg-body_dark text-body"
          icon="fas fa-list"
          :route="{ name: 'teams.browse' }"
        />
        <IconLink
          v-if="$can('update', team)"
          class="hover:bg-body_dark text-body"
          icon="fas fa-edit"
          :route="{ name: 'teams.update' }"
        />
      </div>
    </div>
  </div>
</template>

<script>

import lang from './lang';
import { useTeamStore } from '@/apps/teams/composables/useTeams';

import PageHeader from '@/components/PageHeader';
import ApplicationHeader from '@/components/ApplicationHeader';
import MegaMenu from '@/components/MegaMenu';
import MegaMenuBlock from '@/components/MegaMenuBlock';
import IconLink from '@/components/IconLink';
import {onMounted} from '@vue/composition-api';

export default {
  props: {
    id: {
      required: true
    }
  },
  setup(props) {
    const teams = useTeamStore();
    onMounted(() => teams.read.run(props.id));
    return {
      teams,
      showMenu: false
    };
  },
  i18n: lang,
  components: {
    IconLink,
    MegaMenuBlock,
    MegaMenu,
    ApplicationHeader,
    PageHeader,
  },
  computed: {
    team() {
      return this.teams.current;
    }
  },
  methods: {
    fetchData(params) {
      try {
        this.$store.dispatch('team/getMembers', {
          id: params.id
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
