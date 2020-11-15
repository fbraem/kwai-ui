<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <ApplicationHeader :content="$t('training.definitions.title')" />
    </PageHeader>
    <PageSection>
      <FormulateForm
        name="definition"
        v-model="form"
        @submit="submit"
        @submit-raw="checkValidation"
        class="w-full"
      >
        <KwaiFieldset :title="$t('training.definitions.title')">
          <template slot="description">
            Geef een trainingsmoment een naam en een omschrijving.
          </template>
          <FormulateInput
            type="text"
            name="name"
            :label="$t('training.definitions.form.name.label')"
            :placeholder="$t('training.definitions.form.name.placeholder')"
            :required="true"
            validation="required"
            :validation-messages="{
              required: 'Dit veld is verplicht in te vullen.'
            }"
          />
          <FormulateInput
            type="textarea"
            name="description"
            :label="$t('training.definitions.form.description.label')"
            :placeholder="$t('training.definitions.form.description.placeholder')"
            :rows="5"
          />
        </KwaiFieldset>
        <KwaiFieldset :title="$t('training.definitions.form.active.label')">
          <template slot="description">
            Is dit trainingsmoment actief?
          </template>
          <FormulateInput
            name="active"
            type="checkbox"
          />
        </KwaiFieldset>
        <KwaiFieldset title="Tijdstip">
          <template slot="description">
            Wanneer gaat dit trainingsmoment door?
          </template>
          <div class="w-full sm:pl-2 mb-3">
            <FormulateInput
              name="weekday"
              type="select"
              :label="$t('training.definitions.form.weekday.label')"
              :placeholder="$t('training.definitions.form.weekday.placeholder')"
              :options="weekdays"
              validation="required"
              :required="true"
              :validation-messages="{
                required: 'Dit veld is verplicht in te vullen.'
              }"
            ></FormulateInput>
          </div>
          <div class="w-full flex flex-wrap">
            <div class="w-full sm:w-1/2 sm:pl-2">
              <FormulateInput
                name="start_time"
                :label="$t('training.definitions.form.start_time.label')"
                :required="true"
                validation="^required|kwaitime"
                :validation-messages="{
                    required: 'Dit veld is verplicht in te vullen.',
                    kwaitime: $t('training.definitions.form.invalid_time')
                  }"
              />
            </div>
            <div class="w-full sm:w-1/2 sm:pl-2">
              <FormulateInput
                name="end_time"
                :label="$t('training.definitions.form.end_time.label')"
                :required="true"
                validation="^required|kwaitime|after_start"
                :validation-rules="{
                  after_start: isAfterStartTime
                }"
                :validation-messages="{
                  required: 'Dit veld is verplicht in te vullen.',
                  kwaitime: $t('training.definitions.form.invalid_time'),
                  after_start: 'Tijdstip moet na starttijd liggen'
                }"
              />
            </div>
          </div>
        </KwaiFieldset>
        <KwaiFieldset title="Seizoen">
          <template slot="description">
            Is dit trainingsmoment seizoensgebonden?
          </template>
          <FormulateInput
            v-if="Object.keys(seasonsAsOptions).length > 1"
            name="season"
            type="select"
            :placeholder="$t('training.definitions.form.season.placeholder')"
            :options="seasonsAsOptions"
          ></FormulateInput>
        </KwaiFieldset>
        <KwaiFieldset :title="$t('training.definitions.form.team.label')">
          <template slot="description">
            Is dit trainingsmoment voor een specifiek team?
          </template>
          <FormulateInput
            v-if="Object.keys(teamsAsOptions).length > 1"
            name="team"
            type="select"
            :placeholder="$t('training.definitions.form.team.placeholder')"
            :options="teamsAsOptions"
          ></FormulateInput>
        </KwaiFieldset>
        <KwaiFieldset :title="$t('training.definitions.form.location.label')">
          <template slot="description">
            Gaat dit trainingsmoment altijd op dezelfde plaats door?<br />
            Zo ja, geef dan hier de locatie in.
          </template>
          <FormulateInput
            name="location"
            :placeholder="$t('training.definitions.form.location.placeholder')"
          />
        </KwaiFieldset>
        <KwaiFieldset :title="$t('training.definitions.form.remark.label')">
          <template slot="description">
            Geef eventueel nog een opmerking in over dit trainingsmoment.<br />
            Deze opmerking zal niet zichtbaar zijn voor gewone bezoekers van de
            website.
          </template>
          <FormulateInput
            name="remark"
            type="textarea"
            :rows="5"
            :placeholder="$t('training.definitions.form.remark.placeholder')"
          />
        </KwaiFieldset>
        <Alert v-if="hasFormErrors">
          <FormulateErrors />
        </Alert>
        <div class="flex justify-end mt-3">
          <FormulateInput
            type="submit"
            :input-class="[
              'bg-primary', 'hover:bg-primary_dark', 'text-primary_light'
            ]"
          >
            <i
              v-if="definitions.save.isRunning"
              class="fas fa-spinner fa-spin mr-2"
            ></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ $t('save') }}
          </FormulateInput>
        </div>
      </FormulateForm>
    </PageSection>
  </div>
</template>

<script>
import moment from 'moment';

import messages from './lang';
// eslint-disable-next-line max-len
import {getCurrentInstance, reactive, ref, computed, onMounted} from '@vue/composition-api';
import {useDefinitionStore} from '@/apps/trainings/composables/useDefinitions';
import {useSeasonStore} from '@/apps/seasons/composables/useSeasons';
import {useTeamStore} from '@/apps/teams/composables/useTeams';
import {useOptions} from '@/js/useOptions';

import PageHeader from '@/components/PageHeader.vue';
import PageSection from '@/components/PageSection.vue';
import KwaiFieldset from '@/components/forms/KwaiFieldset.vue';
import Alert from '@/components/Alert.vue';
import ApplicationHeader from '@/components/ApplicationHeader.vue';

import Definition from '@/models/trainings/Definition';
import Season from '@/models/Season';
import Team from '@/models/Team';

export default {
  props: {
    id: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const vm = getCurrentInstance();

    const definitions = useDefinitionStore();
    const seasons = useSeasonStore();
    const teams = useTeamStore();

    onMounted(async() => {
      await seasons.load.run();
      await teams.load.run();
    });

    const form = ref({
      name: '',
      description: '',
      active: true,
      location: '',
      start_time: '',
      end_time: '',
      weekday: null,
      season: null,
      team: null,
      remark: ''
    });
    let hasFormErrors = ref(false);
    let hasValidationErrors = ref(false);

    if (props.id) {
      onMounted(async() => {
        await definitions.read.run(props.id);
        form.value.name = definitions.current.name;
        form.value.description = definitions.current.description;
        form.value.active = definitions.current.active;
        form.value.location = definitions.current.location;
        form.value.start_time = definitions.current.formattedStartTime;
        form.value.end_time = definitions.current.formattedEndTime;
        form.value.weekday = definitions.current.weekday;
        form.value.season = definitions.current.season?.id ?? null;
        form.value.team = definitions.current.team?.id ?? null;
      });
    }

    const seasonsAsOptions = computed(
      () => useOptions(seasons.all, (season) => season.name)
    );
    const teamsAsOptions = computed(
      () => useOptions(teams.all, (team) => team.name)
    );

    async function checkValidation(submission) {
      hasValidationErrors.value = await submission.hasValidationErrors();
    }
    function isAfterStartTime({ value, getFormValues, name }) {
      const startTimeField = getFormValues()['start_time'];
      if (startTimeField) {
        const startTime = moment(startTimeField, 'HH:mm', true);
        if (startTime.isValid()) {
          return moment(value, 'HH:mm', true).isAfter(startTime);
        }
      }
      return true;
    }

    async function submit() {
      const definition = props.id ? definitions.current : new Definition();
      definition.name = form.value.name;
      definition.description = form.value.description;
      definition.active = form.value.active;
      definition.remark = form.value.remark;
      definition.location = form.value.location;
      definition.start_time = moment(form.value.start_time, 'HH:mm', true);
      definition.end_time = moment(form.value.end_time, 'HH:mm', true);
      definition.weekday = form.value.weekday;
      if (form.value.season) {
        if (form.value.season === 0) {
          definition.season = null;
        } else {
          definition.season = new Season(form.value.season);
        }
      }
      if (form.value.team) {
        if (form.value.team === 0) {
          definition.team = null;
        } else {
          definition.team = new Team(form.value.team);
        }
      }
      await definitions.save.run(definition);
      if (definitions.save.error) {
        console.log(definitions.save.error);
      } else {
        await vm.$router.push({
          name: 'trainings.definitions.read',
          params: {
            id: definitions.current.id
          }
        });
      }
    }

    const title = computed(() =>
      props.id ? vm.$t('training.definitions.update')
        : vm.$t('training.definitions.create')
    );

    const weekdays = moment.weekdays(true).map((d, i) => {
      return {
        value: i + 1,
        label: d
      };
    });

    return {
      definitions: reactive(definitions),
      form,
      hasFormErrors,
      hasValidationErrors,
      checkValidation,
      isAfterStartTime,
      submit,
      title,
      weekdays,
      seasonsAsOptions,
      teamsAsOptions
    };
  },
  components: {
    ApplicationHeader,
    Alert,
    PageHeader, PageSection, KwaiFieldset
  },
  i18n: messages
};
</script>
