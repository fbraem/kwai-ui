<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <ApplicationHeader :content="$t('training.events.title')" />
    </PageHeader>
    <PageSection>
      <FormulateForm
        name="training"
        v-model="form"
        @submit="submit"
        @submit-raw="checkValidation"
        class="w-full"
      >
        <KwaiFieldset title="Training">
          <template slot="description">
            Geef de training een titel en omschrijving.
          </template>
          <FormulateInput
            name="title"
            :label="$t('training.events.form.title.label')"
            :placeholder="$t('training.events.form.title.placeholder')"
            :required="true"
            validation="required"
            :validation-messages="{
              required: 'Dit veld is verplicht in te vullen'
            }"
          />
          <FormulateInput
            type="textarea"
            name="summary"
            :label="$t('training.events.form.summary.label')"
            :placeholder="$t('training.events.form.summary.placeholder')"
            :rows="5"
          />
        </KwaiFieldset>
        <KwaiFieldset title="Actief">
          <template slot="description">
            Enkel wanneer de training actief is zal ze getoond worden
            in de kalender.
          </template>
          <FormulateInput
            type="checkbox"
            name="active"
            :label="$t('training.events.form.active.label')"
          />
        </KwaiFieldset>
        <KwaiFieldset title="Annulatie">
          <template slot="description">
            Een geannuleerde training wordt getoond met de
            indicatie "geannuleerd".
          </template>
          <FormulateInput
            type="checkbox"
            name="cancelled"
            :label="$t('training.events.form.cancelled.label')"
          />
        </KwaiFieldset>
        <KwaiFieldset title="Tijdstip">
          <template slot="description">
            Wanneer wordt deze training gehouden?
          </template>
          <FormulateInput
            name="start_date"
            :label="$t('training.events.form.start_date.label')"
            :required="true"
            validation="^required|kwaidate"
            :validation-messages="{
                    required: 'Dit veld is verplicht in te vullen.',
                    kwaidate: $t('training.events.form.invalid_date', { format: dateFormat })
                  }"
            :placeholder="$t('training.events.form.start_date.placeholder', { format: dateFormat })"
          />
          <div class="mt-4 flex flex-row flex-wrap space-y-2 sm:space-y-0">
            <div class="sm:pr-6 w-full sm:w-1/2">
              <FormulateInput
                name="start_time"
                :label="$t('training.events.form.start_time.label')"
                :required="true"
                validation="^required|kwaitime"
                :validation-messages="{
                    required: 'Dit veld is verplicht in te vullen.',
                    kwaitime: $t('training.events.form.invalid_time', { format: 'HH:MM' })
                  }"
                :placeholder="$t('training.events.form.start_time.placeholder', { format: 'HH:MM' })"
              />
            </div>
            <div class="w-full sm:w-1/2">
              <FormulateInput
                name="end_time"
                :label="$t('training.events.form.end_time.label')"
                :required="true"
                validation="^bail|required|kwaitime|after_start"
                :validation-rules="{
                  after_start: isAfterStartTime
                }"
                :validation-messages="{
                      required: 'Dit veld is verplicht in te vullen.',
                      kwaitime: $t('training.events.form.invalid_time', { format: 'HH:MM' }),
                      after_start: 'Tijdstip moet na starttijd liggen'
                    }"
                :placeholder="$t('training.events.form.end_time.placeholder', { format: 'HH:MM' })"
              />
            </div>
          </div>
        </KwaiFieldset>
        <KwaiFieldset title="Seizoen">
          <template slot="description">
            Is deze training seizoensgebonden?
          </template>
          <FormulateInput
            v-if="Object.keys(seasonOptions).length > 1"
            name="season"
            type="select"
            :placeholder="$t('training.events.form.season.placeholder')"
            :options="seasonOptions"
          ></FormulateInput>
        </KwaiFieldset>
        <KwaiFieldset title="Locatie">
          <template slot="description">
            Waar gaat de training door?
          </template>
          <FormulateInput
            name="location"
            :placeholder="$t('training.events.form.location.placeholder')"
          >
          </FormulateInput>
        </KwaiFieldset>
        <KwaiFieldset title="Teams">
          <template slot="description">
            Welke teams kunnen deelnemen aan deze training?
          </template>
          <FormulateInput
            name="teams"
            type="checkbox"
            :options="teamOptions"
            element-class="flex flex-wrap"
            input-class="w-1/2 sm:w-1/3"
          />
        </KwaiFieldset>
        <KwaiFieldset title="Coaches">
          <template slot="description">
            Wie zijn de coaches voor deze training?
          </template>
          <FormulateInput
            name="coaches"
            type="checkbox"
            :options="coachOptions"
            element-class="flex flex-wrap"
            input-class="w-1/2 sm:w-1/3"
          />
        </KwaiFieldset>
        <KwaiFieldset title="Opmerking">
          <template slot="description">
            Een opmerking wordt niet publiekelijk getoond.
          </template>
          <FormulateInput
            type="textarea"
            name="remark"
            :placeholder="$t('training.events.form.remark.placeholder')"
            :rows="5"
          />
        </KwaiFieldset>
        <div class="flex justify-end mt-3">
          <FormulateErrors />
          <FormulateInput
            type="submit"
            :input-class="[
              'bg-primary', 'hover:bg-primary_dark', 'text-primary_light'
            ]"
          >
            <i
              v-if="trainings.save.isRunning"
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
import {useTrainingStore} from '@/apps/trainings/composables/useTrainings';
// eslint-disable-next-line max-len
import {computed, getCurrentInstance, reactive, ref, onMounted} from '@vue/composition-api';
import {useSeasonStore} from '@/apps/seasons/composables/useSeasons';
import {useCoachStore} from '@/apps/trainings/composables/useCoaches';
import {useTeamStore} from '@/apps/teams/composables/useTeams';
import PageHeader from '@/components/PageHeader';
import PageSection from '@/components/PageSection';
import ApplicationHeader from '@/components/ApplicationHeader';
import KwaiFieldset from '@/components/forms/KwaiFieldset';
import Training from '@/models/trainings/Training';
import Season from '@/models/Season';
import Coach from '@/models/trainings/Coach';
import Team from '@/models/Team';

export default {
  props: {
    id: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const trainings = useTrainingStore();
    const seasons = useSeasonStore();
    const coaches = useCoachStore();
    const teams = useTeamStore();

    const dateFormat = ref(moment.localeData().longDateFormat('L'));

    const form = ref({
      title: '',
      summary: '',
      active: false,
      cancelled: false,
      location: null,
      start_date: '',
      start_time: '',
      end_time: '',
      coaches: [],
      season: null,
      teams: null,
      remark: '',
    });

    const hasValidationErrors = ref(false);
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

    seasons.load.run();
    coaches.load.run();
    teams.load.run();

    if (props.id) {
      onMounted(async() => {
        await trainings.read.run(props.id);
        form.value.title = trainings.current.content.title;
        form.value.summary = trainings.current.content.summary;
        form.value.active = trainings.current.event.active;
        form.value.cancelled = trainings.current.event.cancelled;
        form.value.location = trainings.current.event.location;
        form.value.start_date = trainings.current.formattedStartDate;
        form.value.start_time = trainings.current.formattedStartTime;
        form.value.end_time = trainings.current.formattedEndTime;
        form.value.coaches = trainings.current.coaches;
        form.value.season = trainings.current.season?.id ?? null;
        form.value.teams = trainings.current.teams;
      });
    }
    async function submit() {
      const training = props.id ? trainings.current : new Training();
      if (!training.event) {
        training.event = {
          contents: [{}]
        };
      }
      training.event.contents[0].title = form.value.title;
      training.event.contents[0].summary = form.value.summary;
      training.event.active = form.value.active;
      training.event.cancelled = form.value.cancelled;
      training.event.location = form.value.location;
      training.event.time_zone = moment.tz.guess();
      const date = moment(form.value.start_date, 'L', true);
      const startTime = moment(form.value.start_time, 'HH:mm', true);
      training.event.start_date = date.clone();
      training.event.start_date.hours(startTime.hours());
      training.event.start_date.minutes(startTime.minutes());
      training.event.end_date = date.clone();
      const endTime = moment(form.value.end_time, 'HH:mm', true);
      training.event.end_date.hours(endTime.hours());
      training.event.end_date.minutes(endTime.minutes());
      training.event.remark = form.value.remark;
      training.coaches = form.value.coaches.map((id) => new Coach(id));
      training.teams = form.value.teams.map((id) => new Team(id));
      if (form.value.season) {
        if (form.value.season.id === 0) {
          training.season = null;
        } else {
          training.season = new Season(form.value.season.id);
        }
      }
      await trainings.save.run(training);
      if (trainings.save.error) {
        console.log(trainings.save.error);
      } else {
        await vm.$router.push({
          name: 'trainings.read',
          params: {
            id: trainings.current.id
          }
        });
      }
    }

    const vm = getCurrentInstance();

    const seasonOptions = computed(() => {
      const options = seasons.asOptions;
      options[0] = vm.$t('training.events.form.season.no_season');
      return options;
    });
    const teamOptions = computed(() => teams.asOptions);
    const coachOptions = computed(() => coaches.asOptions);

    return {
      trainings: reactive(trainings),
      coaches: reactive(coaches),
      seasons: reactive(seasons),
      teams: reactive(teams),
      dateFormat,
      form,
      submit,
      hasValidationErrors,
      checkValidation,
      isAfterStartTime,
      seasonOptions,
      teamOptions,
      coachOptions
    };
  },
  components: {
    KwaiFieldset,
    PageHeader,
    PageSection,
    ApplicationHeader,
  },
  i18n: messages
};
</script>
