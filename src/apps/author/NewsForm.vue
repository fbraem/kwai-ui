<template>
  <!-- eslint-disable max-len -->
  <PageSection>
    <HeaderLine :content="title" />
    <FormulateForm
      name="newsstory"
      v-model="form"
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
          <i
            v-if="store.save.isRunning"
            class="fas fa-spinner fa-spin mr-2"
          ></i>
          <i v-else class="fas fa-save mr-2"></i>
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

import KwaiFieldset from '@/components/forms/KwaiFieldset.vue';
import HeaderLine from '@/components/HeaderLine.vue';
import PageSection from '@/components/PageSection.vue';
import Alert from '@/components/Alert.vue';

import Application from '@/models/Application';
import {useAuthorNewsStore} from '@/apps/author/composables/useNews';
// eslint-disable-next-line max-len
import {onMounted, reactive, ref, computed, getCurrentInstance} from '@vue/composition-api';
import Story from '@/models/Story';
import {useApplicationStore} from '@/site/composables/useApplications';

const createDatetime = (date, time) => {
  if (time == null || time.length === 0) {
    time = '00:00';
  }
  date += ' ' + time;
  return moment(date, 'L HH:mm', true);
};

export default {
  props: {
    id: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const store = useAuthorNewsStore();

    const form = ref({
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
    });

    const hasFormErrors = ref(false);
    const hasValidationErrors = ref(false);

    async function checkValidation(submission) {
      hasValidationErrors.value = await submission.hasValidationErrors();
    }

    if (props.id) {
      onMounted(async() => {
        await store.read.run(props.id);
        form.value.application = store.current.application.id;
        form.value.enabled = store.current.enabled;
        if (store.current.publish_date) {
          form.value.publish_date = store.current.localPublishDate;
          form.value.publish_time = store.current.localPublishTime;
        }
        if (store.current.end_date) {
          form.value.end_date = store.current.localEndDate;
          form.value.end_time = store.current.localEndTime;
        }
        form.value.promotion = store.current.promotion;
        if (store.current.promotion_end_date) {
          form.value.promotion_end_date = store.current.localPromotionEndDate;
          form.value.promotion_end_time = store.current.localPromotionEndTime;
        }
        form.value.remark = store.current.remark;

        form.value.title = store.current.content.title;
        form.value.summary = store.current.content.summary;
        form.value.content = store.current.content.content;
      });
    }

    const vm = getCurrentInstance();
    const title = computed(() =>
      props.id ? vm.$t('news.create') : vm.$t('news.update')
    );

    const dateFormat = computed(() => moment.localeData().longDateFormat('L'));

    const endTimeValidation = computed(() => {
      if (form.value.end_date) {
        return [
          [ 'bail' ],
          [ 'required' ],
          [ 'kwaitime' ],
          [ 'after_publish', 'end_date' ],
        ];
      }
      return [ ['optional'], ['kwaitime'] ];
    });
    const promotionTimeValidation = computed(() => {
      if (form.value.promotion_end_date) {
        return [
          [ 'bail' ],
          [ 'required' ],
          [ 'kwaitime' ],
          [ 'after_publish', 'promotion_date' ],
        ];
      }
      return [ 'optional', 'kwaitime' ];
    });

    async function submit() {
      const story = props.id ? store.current : new Story();

      story.timezone = moment.tz.guess();
      story.enabled = form.value.enabled;
      story.remark = form.value.remark;
      story.application = new Application();
      story.application.id = form.value.application;
      story.publish_date = createDatetime(
        form.value.publish_date,
        form.value.publish_time
      ).utc();
      if (form.value.end_date) {
        story.end_date = createDatetime(
          form.value.end_date,
          form.value.end_time
        ).utc();
      } else {
        story.end_date = null;
      }
      story.promotion = parseInt(form.value.promotion, 10);
      if (form.value.promotion_end_date) {
        story.promotion_end_date = createDatetime(
          form.value.promotion_end_date,
          form.value.promotion_end_time
        ).utc();
      } else {
        story.promotion_end_date = null;
      }

      if (!story.contents) {
        story.contents = [ Object.create(null) ];
      }
      story.contents[0].locale = 'nl';
      story.contents[0].format = 'md';
      story.contents[0].title = form.value.title;
      story.contents[0].summary = form.value.summary;
      story.contents[0].content = form.value.content;

      await store.save.run(story);
      if (!store.save.error) {
        await vm.$router.push({
          name: 'news.story',
          params: {
            id: store.current.id
          }
        });
      } else {
        console.log(store.save.error);
      }
    }

    const applicationStore = useApplicationStore();
    const applications = computed(() => applicationStore.asOptions());

    return {
      store: reactive(store),
      form,
      hasFormErrors,
      hasValidationErrors,
      checkValidation,
      title,
      dateFormat,
      endTimeValidation,
      promotionTimeValidation,
      submit,
      applications
    };
  },
  i18n: lang,
  components: {
    HeaderLine,
    KwaiFieldset,
    Alert,
    PageSection
  },
  methods: {
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
