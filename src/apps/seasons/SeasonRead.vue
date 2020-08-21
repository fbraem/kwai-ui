<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <div class="flex flex-wrap justify-between">
        <ApplicationHeader :content="$t('seasons')" />
        <div>
          <i
            class="fas fa-bars fa-2x hover:cursor-pointer"
            @click.stop.prevent="showMenu = !showMenu"
          >
          </i>
        </div>
      </div>
      <div v-if="showMenu">
        <MegaMenu
          class="mega-menu"
          role="toggle"
        >
          <MegaMenuBlock
            class="px-4 w-full sm:w-1/2 lg:w-1/4 border-gray-600 border-b sm:border-r lg:border-b-0 pb-6 pt-6 lg:pt-3"
            :to="{ name: 'seasons.read', params: { id: season.id }}"
            linkTitle='Toon het seizoen ...'
          >
            <div class="flex justify-center">
              <div class="h-24 w-24 text-center align-middle rounded-full flex items-center justify-center bg-gray-700 text-2xl">
                {{ season.name }}
              </div>
            </div>
          </MegaMenuBlock>
          <MegaMenuBlock
            class="px-4 w-full sm:w-1/2 lg:w-1/4 border-gray-600 border-b sm:border-r-0 lg:border-r lg:border-b-0 pb-6 pt-6 lg:pt-3"
            :to="{ name: 'seasons.teams', params: { id: season.id }}"
            logo="fas fa-users"
            :title="$t('teams')"
            :linkTitle="$t('show_teams')"
          >
            <div class="flex justify-center align-center mb-2 rounded-full">
              <p class="text-gray-100 text-sm">
                Welke teams zijn er gekoppeld aan dit seizoen?
              </p>
            </div>
          </MegaMenuBlock>
          <MegaMenuBlock
            class="px-4 w-full sm:w-1/2 lg:w-1/4 border-gray-600 border-b sm:border-b-0 sm:border-r md:border-b-0 pb-6 pt-6 lg:pt-3"
            title="Trainingsmomenten"
            logo="fas fa-calendar-alt"
            :to="{ name: 'seasons.definitions', params: { id: season.id }}"
          >
            <p class="text-gray-100 text-sm">
              Zijn er trainingsmomenten gekoppeld aan dit seizoen?
            </p>
          </MegaMenuBlock>
          <MegaMenuBlock
            class="px-4 w-full sm:w-1/2 lg:w-1/4 border-gray-600 pb-6 pt-6 lg:pt-3"
            title="Trainingen"
            logo="fas fa-university"
            :to="{ name: 'seasons.trainings', params: { id: season.id }}"
          >
            <p class="text-gray-100 text-sm">
              Welke trainingen zijn er gekoppeld aan dit seizoen?
            </p>
          </MegaMenuBlock>
        </MegaMenu>
      </div>
    </PageHeader>
    <div class="container mx-auto p-4">
      <router-view
        v-if="season"
        name="season_information"
        :season="season"
      >
      </router-view>
      <div class="mt-2 flex flex-row justify-end">
        <IconLink
          class="hover:bg-body_dark text-body"
          icon="fas fa-list"
          :route="{ name: 'seasons.browse' }"
        />
        <IconLink
          v-if="$can('update', season)"
          class="hover:bg-body_dark text-body"
          icon="fas fa-edit"
          :route="{
            name: 'seasons.update',
            params: {
              id: season.id
            }
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import messages from './lang';

import IconLink from '@/components/IconLink';
import MegaMenu from '@/components/MegaMenu';
import MegaMenuBlock from '@/components/MegaMenuBlock';
import ApplicationHeader from '@/components/ApplicationHeader';
import PageHeader from '@/components/PageHeader';
import {useSeasonStore} from '@/apps/seasons/composables/useSeasons';
import {reactive} from '@vue/composition-api';

export default {
  setup() {
    return {
      seasons: reactive(useSeasonStore())
    };
  },
  components: {
    IconLink,
    PageHeader,
    ApplicationHeader,
    MegaMenu,
    MegaMenuBlock
  },
  i18n: messages,
  data() {
    return {
      showMenu: false
    };
  },
  computed: {
    season() {
      return this.seasons.current;
    },
    isLoading() {
      return this.seasons.read.isRunning;
    },
    toolbar() {
      const buttons = [
        {
          icon: 'fas fa-list',
          route: {
            name: 'seasons.browse'
          }
        },
      ];
      if (this.$can('update', this.season)) {
        buttons.push({
          icon: 'fas fa-edit',
          route: {
            name: 'seasons.update',
            params: {
              id: this.season.id
            }
          }
        });
      }
      return buttons;
    },
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      vm.fetchData(to.params);
      next();
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchData(to.params);
    next();
  },
  methods: {
    async fetchData(params) {
      try {
        await this.seasons.read.run(params.id);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
