<template>
  <!-- eslint-disable max-len -->
  <PageSection>
    <HeaderLine :content="title" />
    <FormulateForm
      name="newsstory"
      v-model="form"
      ref="form"
      @submit="submit"
      @submit-raw="checkValidation"
    >
      <!-- CONTENT -->
      <KwaiFieldset :title="$t('news.form.fieldset.content.title')">
        <template slot="description">
          {{ $t('news.form.fieldset.content.description') }}
        </template>
        <div class="flex flex-wrap">
          <div class="w-full sm:w-auto sm:flex-grow">
            <FormulateInput
              type="text"
              name="title"
              :label="$t('news.form.title.label')"
              :required="true"
              :placeholder="$t('news.form.title.placeholder')"
              validation="required"
              :validation-messages="{
                required: $t('news.form.required')
              }"
            />
          </div>
          <div class="w-full sm:w-auto sm:pl-4 self-center flex-none">
            <FormulateInput
              type="checkbox"
              name="enabled"
              :label="$t('news.form.enabled.label')"
            />
          </div>
        </div>
        <FormulateInput
          type="textarea"
          name="summary"
          rows="5"
          validation="required"
          :label="$t('news.form.summary.label')"
          :required="true"
          :placeholder="$t('news.form.summary.placeholder')"
          :validation-messages="{
            required: $t('news.form.required')
          }"
        />
        <FormulateInput
          type="textarea"
          name="content"
          rows="15"
          :label="$t('news.form.content.label')"
          :placeholder="$t('news.form.content.placeholder')"
        />
      </KwaiFieldset>
      <!-- APPLICATION -->
      <KwaiFieldset :title="$t('news.form.fieldset.application.title')">
        <template slot="description">
          {{ $t('news.form.fieldset.application.description') }}
        </template>
        <FormulateInput
          name="application"
          type="select"
          :placeholder="$t('news.form.application.placeholder')"
          :label="$t('news.form.application.label')"
          :required="true"
          :options="applications"
          validation="required"
          :validation-messages="{
            required: $t('news.form.required')
          }"
        />
      </KwaiFieldset>
      <!-- PUBLICATION TIMINGS -->
      <KwaiFieldset :title="$t('news.form.fieldset.publication.title')">
        <template slot="description">
          {{ $t('news.form.fieldset.publication.description') }}
        </template>
        <div class="flex flex-wrap justify-between">
          <div class="md:pr-6 w-full md:w-1/2 mb-4">
            <FormulateInput
              name="publish_date"
              :label="$t('news.form.publish_date.label')"
              :required="true"
              :placeholder="$t('news.form.publish_date.placeholder', { format : dateFormat })"
              validation="required|kwaidate"
              :validation-messages="{
                required: $t('news.form.required'),
                kwaidate: $t('news.form.invalid_date')
              }"
            />
          </div>
          <div class="md:pr-6 w-full md:w-1/2 mb-4">
            <FormulateInput
              name="publish_time"
              :label="$t('news.form.publish_time.label')"
              :required="true"
              :placeholder="$t('news.form.publish_time.placeholder', { format : 'HH:MM' })"
              validation="required|kwaitime"
              :validation-messages="{
                required: $t('news.form.required'),
                kwaitime: $t('news.form.invalid_time')
              }"
            />
          </div>
        </div>
        <div class="flex flex-wrap justify-between">
          <div class="md:pr-6 w-full md:w-1/2 mb-4">
            <FormulateInput
              name="end_date"
              :label="$t('news.form.end_date.label')"
              :placeholder="$t('news.form.end_date.placeholder', { format : dateFormat })"
              validation="optional|kwaidate"
              :validation-messages="{
                kwaidate: $t('news.form.invalid_date')
              }"
            />
          </div>
          <div class="md:pr-6 w-full md:w-1/2 mb-4">
            <FormulateInput
              name="end_time"
              :label="$t('news.form.end_time.label')"
              :required="form.end_date !== ''"
              :placeholder="$t('news.form.end_time.placeholder', { format : 'HH:MM' })"
              :validation="endTimeValidation"
              :validation-rules="{
                after_publish: isAfterPublishTimestamp
              }"
              :validation-messages="{
                required: $t('news.form.required'),
                kwaitime: $t('news.form.invalid_time'),
                after_publish: $t('news.form.end_date_after')
              }"
            />
          </div>
        </div>
      </KwaiFieldset>
      <!-- PROMOTION -->
      <KwaiFieldset :title="$t('news.form.fieldset.promotion.title')">
        <template slot="description">
          {{ $t('news.form.fieldset.promotion.description') }}
        </template>
        <div class="mb-4">
          <FormulateInput
            type="kwairange"
            name="promotion"
            :label="$t('news.form.promotion.label')"
            :show-value="true"
          />
        </div>
        <div class="flex flex-wrap justify-between">
          <div class="md:pr-6 w-full md:w-1/2 mb-4">
            <FormulateInput
              name="promotion_end_date"
              :label="$t('news.form.promotion_end_date.label')"
              :placeholder="$t('news.form.promotion_end_date.placeholder', { format : dateFormat })"
              validation="optional|kwaidate"
              :validation-messages="{
                kwaidate: $t('news.form.invalid_date')
              }"
            />
          </div>
          <div class="md:pr-6 w-full md:w-1/2">
            <FormulateInput
              name="promotion_end_time"
              :label="$t('news.form.promotion_end_time.label')"
              :required="form.promotion_end_date !== ''"
              :placeholder="$t('news.form.promotion_end_time.placeholder', { format : 'HH:MM' })"
              :validation="promotionTimeValidation"
              :validation-rules="{
                after_publish: isAfterPublishTimestamp
              }"
              :validation-messages="{
                required: $t('news.form.required'),
                kwaitime: $t('news.form.invalid_time'),
                after_publish: $t('news.form.end_date_after')
              }"
            />
          </div>
        </div>
      </KwaiFieldset>
      <KwaiFieldset :title="$t('news.form.fieldset.remark.title')">
        <template slot="description">
          {{ $t('news.form.fieldset.remark.description') }}
        </template>
        <FormulateInput
          type="textarea"
          name="remark"
          :label="$t('news.form.remark.label')"
          :placeholder="$t('news.form.remark.placeholder')"
          :rows="5"
        />
      </KwaiFieldset>
      <Alert
        v-if="hasFormErrors"
        type="danger"
      >
        <FormulateErrors />
      </Alert>
      <Alert
        v-if="hasValidationErrors"
        type="danger"
      >
        {{ $t('news.form.validation_failed') }}
      </Alert>
      <div class="flex justify-end mt-3">
        <FormulateInput
          type="submit"
          :input-class="['bg-primary', 'hover:bg-primary_dark', 'text-primary_light']"
        >
          <i class="fas fa-save mr-2"></i>
          {{ $t('news.form.submit') }}
        </FormulateInput>
      </div>
    </FormulateForm>
  </PageSection>
</template>

<script>
import moment from 'moment';
import 'moment-timezone';

import lang from './lang';

import KwaiFieldset from '@/components/forms/KwaiFieldset';
import HeaderLine from '@/components/HeaderLine';
import PageSection from '@/components/PageSection';
import Application from '@/models/Application';
import Alert from '@/components/Alert';

const createDatetime = (date, time) => {
  if (time == null || time.length === 0) {
    time = '00:00';
  }
  date += ' ' + time;
  return moment(date, 'L HH:mm', true);
};

export default {
  i18n: lang,
  components: {
    HeaderLine,
    KwaiFieldset,
    Alert,
    PageSection
  },
  props: {
    creating: {
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        title: '',
        enabled: false,
        summary: '',
        content: '',
        application: 0,
        publish_date: moment().format('L'),
        publish_time: moment().format('HH:MM'),
        end_date: '',
        end_time: '',
        promotion: 0,
        promotion_end_date: '',
        promotion_end_time: '',
        remark: ''
      },
      hasFormErrors: false,
      hasValidationErrors: false
    };
  },
  computed: {
    title() {
      if (this.creating) return this.$t('news.create');
      return this.$t('news.update');
    },
    story() {
      return this.$store.state.author.news.current;
    },
    dateFormat() {
      return moment.localeData().longDateFormat('L');
    },
    applications() {
      return this.$store.getters['applications/asOptions'](
        (application) => application.news
      );
    },
    endTimeValidation() {
      if (this.form.end_date) {
        return [
          [ 'bail' ],
          [ 'required' ],
          [ 'kwaitime' ],
          [ 'after_publish', 'end_date' ],
        ];
      }
      return [ 'optional', 'kwaitime' ];
    },
    promotionTimeValidation() {
      if (this.form.promotion_end_date) {
        return [
          [ 'bail' ],
          [ 'required' ],
          [ 'kwaitime' ],
          [ 'after_publish', 'promotion_date' ],
        ];
      }
      return [ 'optional', 'kwaitime' ];
    },
    error() {
      return this.$store.state.author.news.error;
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
    async checkValidation(submission) {
      this.hasValidationErrors = await submission.hasValidationErrors();
    },
    async setupForm(params) {
      if (params.id) {
        await this.$store.dispatch('author/news/read', {
          id: params.id
        });

        this.form.application = this.story.application.id;
        this.form.enabled = this.story.enabled;
        if (this.story.publish_date) {
          this.form.publish_date = this.story.localPublishDate;
          this.form.publish_time = this.story.localPublishTime;
        }
        if (this.story.end_date) {
          this.form.end_date = this.story.localEndDate;
          this.form.end_time = this.story.localEndTime;
        }
        this.form.promotion = this.story.promotion;
        if (this.story.promotion_end_date) {
          this.form.promotion_end_date = this.story.localPromotionEndDate;
          this.form.promotion_end_time = this.story.localPromotionEndTime;
        }
        this.form.remark = this.story.remark;

        this.form.title = this.story.content.title;
        this.form.summary = this.story.content.summary;
        this.form.content = this.story.content.content;
      } else {
        await this.$store.dispatch('author/news/create');
      }
    },
    readForm() {
      this.story.timezone = moment.tz.guess();
      this.story.enabled = this.form.enabled;
      this.story.remark = this.form.remark;
      this.story.application = new Application();
      this.story.application.id = this.form.application;
      this.story.publish_date = createDatetime(
        this.form.publish_date,
        this.form.publish_time
      ).utc();
      if (this.form.end_date) {
        this.story.end_date = createDatetime(
          this.form.end_date,
          this.form.end_time
        ).utc();
      } else {
        this.story.end_date = null;
      }
      this.story.promotion = parseInt(this.form.promotion, 10);
      if (this.form.promotion_end_date) {
        this.story.promotion_end_date = createDatetime(
          this.form.promotion_end_date,
          this.form.promotion_end_time
        ).utc();
      } else {
        this.story.promotion_end_date = null;
      }

      if (!this.story.contents) {
        this.story.contents = [ Object.create(null) ];
      }
      this.story.contents[0].locale = 'nl';
      this.story.contents[0].format = 'md';
      this.story.contents[0].title = this.form.title;
      this.story.contents[0].summary = this.form.summary;
      this.story.contents[0].content = this.form.content;
    },
    async submit() {
      this.readForm();
      this.$store.dispatch('author/news/save', this.story)
        .then((story) => {
          this.$router.push({
            name: 'news.story',
            params: {
              id: story.id
            }
          });
        })
        .catch(err => {
          this.$formulate.handle(err, 'newsstory');
          if (this.$refs.form) {
            this.hasFormErrors = this.$refs.form.mergedFormErrors.length > 0;
          }
        });
    },
    isAfterPublishTimestamp({ value, getFormValues, name }, dateField) {
      const after_timestamp = moment(
        this.form.publish_date + ' ' + this.form.publish_time,
        'L HH:mm',
        true
      );
      const formValues = getFormValues();
      const check_date = moment(
        formValues[dateField] + ' ' + value,
        'L HH:mm',
        true
      );
      return check_date.isAfter(after_timestamp);
    }
  }
};
</script>
