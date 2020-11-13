<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <ApplicationHeader content="Trainingsmoment" />
    </PageHeader>
    <PageSection>
      <Spinner v-if="definitions.read.isRunning" />
      <Alert
        v-else-if="! definition"
        type="danger"
      >
          {{ $t('training.definitions.not_found') }}
      </Alert>
      <div
        v-if="definition"
        class="w-full"
      >
        <Attributes :attributes="attributes">
          <template v-slot:value_season="{ attribute }">
            <router-link
              v-if="attribute.value"
              :to="{ name: 'seasons.read', params: { id : attribute.value.id} }"
            >
              {{ attribute.value.name }}
            </router-link>
          </template>
          <template v-slot:value_team="{ attribute }">
            <router-link
              v-if="attribute.value"
              :to="{ name: 'teams.read', params: { id : attribute.value.id} }"
            >
              {{ attribute.value.name }}
            </router-link>
          </template>
          <template v-slot:value_time="{ attribute }">
            <i class="far fa-clock"></i> {{ attribute.value }}
          </template>
        </Attributes>
        <div class="flex justify-between border-t mb-2 sm:mb-4 pt-3">
          <div class="flex flex-wrap text-xs">
            <div class="mr-4">
              <strong>Aangemaakt:</strong> {{ definition.formatted_created_at }}
            </div>
            <div>
              <strong>Laatst gewijzigd:</strong> {{ definition.formatted_updated_at }}
            </div>
          </div>
          <div>
            <div class="mt-2 flex flex-row justify-end">
              <IconLink
                class="hover:bg-body_dark text-body"
                icon="fas fa-list"
                :route="{ name: 'trainings.definitions.browse' }"
              />
              <IconLink
                v-if="$can('update', definition)"
                class="hover:bg-body_dark text-body"
                icon="fas fa-edit"
                :route="{ name: 'trainings.definitions.update' }"
              />
            </div>
          </div>
        </div>
        <TrainingGeneratorForm :definition="definition" />
      </div>
    </PageSection>
  </div>
</template>

<script>
import messages from './lang';

import TrainingGeneratorForm from './TrainingGeneratorForm';
import Spinner from '@/components/Spinner';
import Alert from '@/components/Alert';
import Attributes from '@/components/Attributes';
import {useDefinitionStore} from '@/apps/trainings/composables/useDefinitions';
// eslint-disable-next-line max-len
import {onMounted, reactive, computed, watch, getCurrentInstance} from '@vue/composition-api';
import PageHeader from '@/components/PageHeader';
import PageSection from '@/components/PageSection';
import ApplicationHeader from '@/components/ApplicationHeader';
import IconLink from '@/components/IconLink';
import {provideTrainingStore} from '@/apps/trainings/composables/useTrainings';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const vm = getCurrentInstance();

    const definitions = useDefinitionStore();

    onMounted(() => {
      definitions.read.run(props.id);
    });
    watch(() => props.id, (nv) => definitions.read.run(nv));
    const definition = computed(() => definitions.current);

    const attributes = computed(() => {
      if (!definition.value) return {};
      return {
        name: {
          label: vm.$t('training.definitions.form.name.label'),
          value: definition.value.name
        },
        description: {
          label: vm.$t('training.definitions.form.description.label'),
          value: definition.value.description
        },
        weekday: {
          label: vm.$t('training.definitions.form.weekday.label'),
          value: definition.value.weekdayText
        },
        time: {
          label: vm.$t('training.definitions.time'),
          value:
            definition.value.formattedStartTime
            + ' - '
            + definition.value.formattedEndTime
        },
        team: {
          label: vm.$t('training.definitions.form.team.label'),
          value: definition.value.team
        },
        season: {
          label: vm.$t('training.definitions.form.season.label'),
          value: definition.value.season
        },
        location: {
          label: vm.$t('training.definitions.form.location.label'),
          value: definition.value.location
        },
        remark: {
          label: vm.$t('training.definitions.form.remark.label'),
          value: definition.value.remark
        }
      };
    });

    return {
      definitions: reactive(definitions),
      definition,
      attributes
    };
  },
  components: {
    IconLink,
    ApplicationHeader,
    PageHeader,
    PageSection,
    Spinner,
    TrainingGeneratorForm,
    Alert,
    Attributes
  },
  i18n: messages,
};
</script>
