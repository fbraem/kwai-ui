<template>
  <!-- eslint-disable max-len -->
  <div class="mt-2">
    <div>
      <div>
        <button
          class="red-button disabled:opacity-50 disabled:cursor-not-allowed"
          @click.prevent.stop="showForm = !showForm"
        >
          <i class="far fa-calendar-alt"></i>&nbsp; {{ $t('trainings') }}
        </button>
      </div>
    </div>
    <div
      v-show="showForm"
      class="mt-6"
    >
      <FormulateForm
        name="generate"
        v-model="form"
        @submit="generate"
        @submit-raw="checkValidation"
        class="w-full"
      >
        <KwaiFieldset title="Periode">
          <template slot="description">
            Geef de periode in waarvoor trainingen moeten aangemaakt worden.
          </template>
          <div class="flex flex-row flex-wrap space-y-2 sm:space-y-0">
            <div class="sm:pr-6 w-full sm:w-1/2">
                <FormulateInput
                  name="start_date"
                  label="Start Periode"
                  :required="true"
                  validation="^required|kwaidate"
                  :validation-messages="{
                    required: 'Dit veld is verplicht in te vullen.',
                    kwaidate: $t('training.generator.form.invalid_date', { format: dateFormat })
                  }"
                  :placeholder="$t('training.generator.form.start_date.placeholder', { format: dateFormat })"
                />
            </div>
            <div class="w-full sm:w-1/2">
              <FormulateInput
                name="end_date"
                label="Einde Periode"
                :required="true"
                validation="^required|kwaidate"
                :validation-messages="{
                    required: 'Dit veld is verplicht in te vullen.',
                    kwaidate: $t('training.generator.form.invalid_date', { format: dateFormat })
                  }"
                :placeholder="$t('training.generator.form.end_date.placeholder', { format: dateFormat })"
              />
            </div>
          </div>
        </KwaiFieldset>
        <KwaiFieldset title="Coaches">
          <template slot="description">
            Selecteer de coaches voor deze trainingen.
          </template>
          <FormulateInput
            name="coaches"
            type="checkbox"
            :options="coaches.asOptions"
            element-class="flex flex-wrap"
            input-class="w-1/2 sm:w-1/3"
            label-class="text-red-900"
          />
        </KwaiFieldset>
        <div class="flex justify-end mt-3">
          <FormulateInput
            type="submit"
            :input-class="[
              'bg-primary', 'hover:bg-primary_dark', 'text-primary_light'
            ]"
          >
            {{ $t('training.generator.form.generate') }}
          </FormulateInput>
        </div>
      </FormulateForm>
    </div>
    <EventGenerate
      v-if="trainings"
      :trainings="trainings"
      @generate="createAll"
    ></EventGenerate>
    <notifications position="bottom right" />
  </div>
</template>

<script>
import moment from 'moment';

import messages from './lang';

import Training from '@/models/trainings/Training';

import KwaiFieldset from '@/components/forms/KwaiFieldset';
import EventGenerate from './TrainingGenerate.vue';

import {useCoachStore} from '@/apps/trainings/composables/useCoaches';
import {onMounted, reactive, ref} from '@vue/composition-api';
import createTrainingService from '@/apps/trainings/composables/useTrainings';

export default {
  props: {
    definition: {
      required: true
    }
  },
  setup(props) {
    const coaches = useCoachStore();
    const trainingService = createTrainingService();

    const dateFormat = ref(moment.localeData().longDateFormat('L'));
    const form = ref({
      start_date: ref(moment().format(dateFormat.value)),
      end_date: ref(
        moment().add(1, 'months').format(dateFormat.value)
      ),
      coaches: ref([])
    });
    const showForm = ref(false);
    let hasFormErrors = ref(false);
    let hasValidationErrors = ref(false);
    async function checkValidation(submission) {
      hasValidationErrors.value = await submission.hasValidationErrors();
    }

    onMounted(() => coaches.load.run());

    return {
      coaches: reactive(coaches),
      trainingService: reactive(trainingService),
      form,
      dateFormat,
      hasFormErrors,
      hasValidationErrors,
      checkValidation,
      showForm
    };
  },
  components: {
    KwaiFieldset, EventGenerate
  },
  i18n: messages,
  data() {
    return {
      trainings: null,
    };
  },
  methods: {
    generate() {
      const selectedCoaches = this.form.coaches.map(
        id => this.coaches.all.find((c) => c.id === id)
      );
      const tz = moment.tz.guess();
      const start = moment(this.form.start_date, 'L');
      const end = moment(this.form.end_date, 'L');
      let next = start.day(this.definition.weekday);
      const trainings = [];
      while (next.isBefore(end)) {
        const training = new Training();
        training.event = Object.create(null);
        const content = Object.create(null);
        content.title = this.definition.name;
        content.summary = this.definition.description;
        training.event.contents = [ content ];
        const s = next.clone();
        s.hours(this.definition.start_time.hours());
        s.minutes(this.definition.start_time.minutes());
        training.event.start_date = s;

        const e = next.clone();
        e.hours(this.definition.end_time.hours());
        e.minutes(this.definition.end_time.minutes());
        training.event.end_date = e;

        training.event.location = this.definition.location;
        training.event.time_zone = tz;
        training.definition = this.definition;
        // TODO: Make it possible to assign multiple teams to a definition
        if (this.definition.team) {
          training.teams = [ this.definition.team ];
        }
        training.coaches = selectedCoaches;
        trainings.push(training);
        next = next.day(this.definition.weekday + 7);
      }
      this.trainings = trainings;
    },
    async createAll(selection) {
      await this.trainingService.saveAll.run(this.trainings);
      if (this.trainingService.saveAll.error) {
        console.log(this.trainingService.saveAll.error);
      } else {
        this.trainings = null;
        this.$notify({
          type: 'success',
          title: 'Success!',
          text: 'All trainings were created!'
        });
      }
    }
  }
};
</script>
