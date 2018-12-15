<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <div class="uk-grid">
        <div class="uk-width-5-6">
          <h1>{{ $t('training.definitions.title') }}</h1>
        </div>
        <div class="uk-width-1-6">
          <div class="uk-flex uk-flex-right">
            <router-link v-if="$training_definition.isAllowed('create')" class="uk-icon-button uk-link-reset" :to="{ name : 'trainings.definitions.create' }">
              <i class="fas fa-plus"></i>
            </router-link>
          </div>
        </div>
      </div>
    </PageHeader>
    <section class="uk-section uk-section-small uk-container uk-container-expand">
      <div v-if="$wait.is('training.definitions.browse')" class="uk-flex-center" uk-grid>
        <div class="uk-text-center">
          <i class="fas fa-spinner fa-2x fa-spin"></i>
        </div>
      </div>
      <div v-else class="uk-child-width-1-1" uk-grid>
        <div v-if="noData" class="uk-alert uk-alert-warning">
          {{ $t('training.definitions.no_data') }}
        </div>
        <div v-else>
          <table class="uk-table uk-table-small uk-table-divider uk-table-middle">
            <tr>
              <th>{{ $t('name') }}</th>
              <th>{{ $t('description') }}</th>
              <th>{{ $t('season') }}</th>
              <th class="uk-table-shrink"></th>
            </tr>
            <tr v-for="definition in definitions" :key="definition.id">
              <td>
                <router-link :to="{ name: 'trainings.definitions.read', params: { id : definition.id} }">{{ definition.name }}</router-link>
              </td>
              <td class="uk-text-meta">
                {{ definition.description }}
              </td>
              <td>
                <router-link v-if="definition.season" :to="{ name: 'seasons.read', params: { id : definition.season.id} }">{{ definition.season.name }}</router-link>
              </td>
              <td>
                <router-link class="uk-icon-button uk-link-reset" v-if="$training_definition.isAllowed('update', definition)" :to="{ name : 'trainings.definitions.update', params : { id : definition.id } }">
                  <i class="fas fa-edit uk-text-muted"></i>
                </router-link>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import PageHeader from '@/site/components/PageHeader';

import messages from './lang';

import trainingDefinitionStore from '@/stores/training/definitions';

export default {
  components: {
    PageHeader
  },
  i18n: messages,
  computed: {
    definitions() {
      return this.$store.getters['trainingDefinitionModule/definitions'];
    },
    noData() {
      return this.definitions && this.definitions.length === 0;
    }
  },
  beforeCreate() {
    if (!this.$store.state.trainingDefinitionModule) {
      this.$store.registerModule(
        'trainingDefinitionModule',
        trainingDefinitionStore
      );
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$store.dispatch('trainingDefinitionModule/browse');
    }
  }
};
</script>