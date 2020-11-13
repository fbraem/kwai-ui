<template>
  <!-- eslint-disable max-len -->
  <PageSection>
    <HeaderLine :content="title" />
    <FormulateForm
      name="season"
      v-model="form"
      ref="form"
      @submit="submit"
      @submit-raw="checkValidation"
      class="w-full"
    >
      <KwaiFieldset title="Season">
        <template slot="description">
          {{ $t('form.season.fieldset.season.description') }}
        </template>
        <div class="w-full">
          <FormulateInput
            name="name"
            :label="$t('form.season.name.label')"
            :required="true"
            :placeholder="$t('form.season.name.placeholder')"
            validation="required"
            :validation-messages="{
              required: $t('form.required')
            }"
          >
          </FormulateInput>
        </div>
        <div class="flex flex-wrap justify-between">
          <div class="md:pr-6 w-full md:w-1/2 mb-4">
            <FormulateInput
              name="start_date"
              :label="$t('form.season.start_date.label')"
              :required="true"
              :placeholder="$t('form.season.start_date.placeholder', { format: dateFormat })"
              validation="required|kwaidate"
              :validation-messages="{
                required: $t('form.required'),
                kwaidate: $t('form.invalid_date', { format: dateFormat })
              }"
            >
            </FormulateInput>
          </div>
          <div class="w-full md:w-1/2 mb-4">
            <FormulateInput
                name="end_date"
                :label="$t('form.season.end_date.label')"
                :required="true"
                :placeholder="$t('form.season.end_date.placeholder', { format: dateFormat })"
                validation="required|kwaidate"
                :validation-messages="{
                required: $t('form.required'),
                kwaidate: $t('form.invalid_date', { format: dateFormat })
              }"
            >
            </FormulateInput>
          </div>
        </div>
      </KwaiFieldset>
      <KwaiFieldset :title="$t('form.season.fieldset.remark.title')">
        <template slot="description">
          {{ $t('form.season.fieldset.remark.description')}}
        </template>
        <FormulateInput
            type="textarea"
            name="remark"
            :label="$t('form.season.remark.label')"
            :placeholder="$t('form.season.remark.placeholder')"
            :rows="5"
        />
      </KwaiFieldset>
      <div class="flex justify-end mt-3">
        <FormulateInput
            type="submit"
            :input-class="['bg-primary', 'hover:bg-primary_dark', 'text-primary_light']"
        >
          <i
              v-if="seasons.save.isRunning"
              class="fas fa-spinner fa-spin mr-2"
          ></i>
          <i v-else class="fas fa-save mr-2"></i>
          {{ $t('form.season.submit') }}
        </FormulateInput>
      </div>
    </FormulateForm>
  </PageSection>
</template>

<script>
import moment from 'moment';

import messages from './lang';
import PageSection from '@/components/PageSection';
import KwaiFieldset from '@/components/forms/KwaiFieldset';
import Season from '@/models/Season';
import HeaderLine from '@/components/HeaderLine';
import {useSeasonStore} from '@/apps/seasons/composables/useSeasons';
import {reactive} from '@vue/composition-api';

export default {
  setup() {
    return {
      seasons: reactive(useSeasonStore())
    };
  },
  i18n: messages,
  components: {
    HeaderLine,
    KwaiFieldset,
    PageSection,
  },
  data() {
    return {
      hasValidationErrors: false,
      hasFormErrors: false,
      form: {
        name: '',
        start_date: moment().format('L'),
        end_date: '',
        remark: ''
      }
    };
  },
  computed: {
    dateFormat() {
      return moment.localeData().longDateFormat('L');
    },
    title() {
      return this.$route.params.id ? this.$t('update') : this.$t('create');
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      await vm.setupForm(to.params);
      next();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await this.setupForm(to.params);
    next();
  },
  methods: {
    async setupForm(params) {
      if (params.id) {
        await this.seasons.read.run(params.id);
        this.form.name = this.seasons.current.name;
        this.form.start_date = this.seasons.current.formatted_start_date;
        this.form.end_date = this.seasons.current.formatted_end_date;
        this.form.remark = this.seasons.current.remark;
      }
    },
    async submit() {
      // eslint-disable-next-line max-len
      const season = this.$route.params.id ? this.seasons.current : new Season();
      season.name = this.form.name;
      season.start_date = moment(this.form.start_date, 'L');
      season.end_date = moment(this.form.end_date, 'L');
      season.remark = this.form.remark;
      await this.seasons.save.run(season);
      if (!this.seasons.save.error) {
        await this.$router.push({
          name: 'seasons.read',
          params: {
            id: this.seasons.current.id
          }
        });
      } else {
        console.log(this.seasons.save.error);
      }
    },
    async checkValidation(submission) {
      this.hasValidationErrors = await submission.hasValidationErrors();
    }
  }
};
</script>
