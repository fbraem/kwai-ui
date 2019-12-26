<template>
  <!-- eslint-disable max-len -->
  <KwaiForm
    :title="title"
    :form="form"
    :error="error"
    :save="$t('save')"
    @submit="submit"
  >
    <KwaiFieldset :title="$t('content')">
      <template slot="description">
        Geef een titel voor het bericht. De samenvatting zal in overzichten
        getoond worden. In de samenvatting en de inhoud kan je Markdown
        gebruiken.
      </template>
      <div class="flex flex-wrap mb-3">
        <div class="w-full sm:w-auto sm:flex-grow">
          <KwaiField
            name="title"
            :label="$t('form.content.title.label')"
            class="mb-3"
          >
            <KwaiInputText :placeholder="$t('form.content.title.placeholder')" />
          </KwaiField>
        </div>
        <div class="w-full sm:w-auto sm:pl-4 self-begin flex-none">
          <KwaiField
            name="enabled"
            :label="$t('form.story.enabled.label')"
          >
            <KwaiSwitch />
          </KwaiField>
        </div>
      </div>
      <KwaiField
        name="summary"
        :label="$t('form.content.summary.label')"
        class="mb-3"
      >
        <KwaiTextarea
          :placeholder="$t('form.content.summary.placeholder')"
          :rows="5"
        />
      </KwaiField>
      <KwaiField
        name="content"
        :label="$t('form.content.content.label')"
      >
        <KwaiTextarea
          :placeholder="$t('form.content.content.placeholder')"
          :rows="15"
        />
      </KwaiField>
    </KwaiFieldset>
    <KwaiFieldset :title="$t('form.story.category.label')">
      <template slot="description">
        Tot welke categorie behoort dit nieuwsbericht?
      </template>
      <KwaiField
        name="category"
        :label="$t('form.story.category.label')"
      >
        <KwaiSelect :items="categories" />
      </KwaiField>
    </KwaiFieldset>
    <KwaiFieldset title="Publicatie">
      <template slot="description">
        Wanneer moet dit bericht gepubliceerd worden?
      </template>
      <div class="flex flex-wrap justify-between">
        <div class="md:pr-6 w-full md:w-1/2">
          <KwaiField
            name="publish_date"
            :label="$t('form.story.publish_date.label')"
          >
            <KwaiInputText :placeholder="$t('form.story.publish_date.placeholder', { format : dateFormat })" />
          </KwaiField>
        </div>
        <div class="md:pr-6 w-full md:w-1/2">
          <KwaiField
            name="publish_time"
            :label="$t('form.story.publish_time.label')"
          >
            <KwaiInputText :placeholder="$t('form.story.publish_time.placeholder', { format : 'HH:MM' })" />
          </KwaiField>
        </div>
      </div>
      <div class="flex flex-wrap justify-between">
        <div class="md:pr-6 w-full md:w-1/2">
          <KwaiField
            name="end_date"
            :label="$t('form.story.end_date.label')"
          >
            <KwaiInputText :placeholder="$t('form.story.end_date.placeholder', { format : dateFormat })" />
          </KwaiField>
        </div>
        <div class="md:pr-6 w-full md:w-1/2">
          <KwaiField
            name="end_time"
            :label="$t('form.story.end_time.label')"
          >
            <KwaiInputText :placeholder="$t('form.story.end_time.placeholder', { format : 'HH:MM' })" />
          </KwaiField>
        </div>
      </div>
    </KwaiFieldset>
    <KwaiFieldset :title="$t('featured')">
      <template slot="description">
        {{ $t('featured_hint') }}
      </template>
      <KwaiField name="featured" :label="$t('form.story.featured_priority.label')">
        <KwaiRange />
      </KwaiField>
      <div class="flex flex-wrap justify-between">
        <div class="md:pr-6 w-full md:w-1/2">
          <KwaiField
            name="featured_end_date"
            :label="$t('form.story.featured_end_date.label')"
          >
            <KwaiInputText :placeholder="$t('form.story.featured_end_date.placeholder', { format : dateFormat })" />
          </KwaiField>
        </div>
        <div class="md:pr-6 w-full md:w-1/2">
          <KwaiField
            name="featured_end_time"
            :label="$t('form.story.featured_end_time.label')"
            >
            <KwaiInputText :placeholder="$t('form.story.featured_end_time.placeholder', { format : 'HH:MM' })" />
          </KwaiField>
        </div>
      </div>
    </KwaiFieldset>
    <KwaiFieldset :title="$t('form.story.remark.label')">
      <template slot="description">
        Geef een eventuele opmerking in. Een opmerking is niet zichtbaar voor
        een bezoeker van de website.
      </template>
      <KwaiField name="remark" :label="$t('form.story.remark.label')">
        <KwaiTextarea
          :rows="5"
          :placeholder="$t('form.story.remark.placeholder')"
        />
      </KwaiField>
    </KwaiFieldset>
  </KwaiForm>
</template>

<script>
import moment from 'moment';
import 'moment-timezone';

import messages from './lang';

import Category from '@/models/Category';

import makeForm, { makeField, notEmpty, isDate, isTime } from '@/js/Form';
const makeStoryForm = (fields) => {

  const createDatetime = (date, time) => {
    if (time == null || time.length === 0) {
      time = '00:00';
    }
    date += ' ' + time;
    return moment(date, 'L HH:mm', true);
  };

  const publishDatetime = () => {
    return createDatetime(
      fields.publish_date.value,
      fields.publish_time.value
    );
  };
  const endDatetime = () => {
    return createDatetime(
      fields.end_date.value,
      fields.end_time.value
    );
  };
  const featuredEndDatetime = () => {
    return createDatetime(
      fields.featured_end_date.value,
      fields.featured_end_time.value
    );
  };

  const writeForm = (story) => {
    fields.category.value = story.category.id;
    fields.enabled.value = story.enabled;
    if (story.publish_date) {
      fields.publish_date.value = story.localPublishDate;
      fields.publish_time.value = story.localPublishTime;
    }
    if (story.end_date) {
      this.story.end_date.value = story.localEndDate;
      this.story.end_time.value = story.localEndTime;
    }
    fields.featured.value = story.featured;
    if (story.featured_end_date) {
      fields.featured_end_date.value = story.localFeaturedEndDate;
      fields.featured_end_time.value = story.localFeaturedEndTime;
    }
    fields.remark.value = story.remark;

    fields.title.value = story.content.title;
    fields.summary.value = story.content.summary;
    fields.content.value = story.content.content;
  };

  const readForm = (story) => {
    story.timezone = moment.tz.guess();
    story.enabled = fields.enabled.value;
    story.remark = fields.remark.value;
    story.category = new Category();
    story.category.id = fields.category.value;
    story.publish_date = publishDatetime().utc();
    if (fields.end_date.value) {
      story.end_date = endDatetime().utc();
    } else {
      story.end_date = null;
    }
    story.featured = fields.featured.value;
    if (fields.featured_end_date.value) {
      story.featured_end_date = featuredEndDatetime().utc();
    } else {
      story.featured_end_date = null;
    }

    if (!story.contents) {
      story.contents = [ Object.create(null) ];
    }
    story.contents[0].title = fields.title.value;
    story.contents[0].summary = fields.summary.value;
    story.contents[0].content = fields.content.value;
  };

  return {
    ...makeForm(fields),
    writeForm,
    readForm
  };
};

import KwaiForm from '@/components/forms/KwaiForm';
import KwaiField from '@/components/forms/KwaiField';
import KwaiFieldset from '@/components/forms/KwaiFieldset';
import KwaiInputText from '@/components/forms/KwaiInputText';
import KwaiSelect from '@/components/forms/KwaiSelect';
import KwaiTextarea from '@/components/forms/KwaiTextarea';
import KwaiSwitch from '@/components/forms/KwaiSwitch';
import KwaiRange from '@/components/forms/KwaiRange';

export default {
  i18n: messages,
  components: {
    KwaiForm,
    KwaiFieldset,
    KwaiField,
    KwaiInputText,
    KwaiSwitch,
    KwaiSelect,
    KwaiTextarea,
    KwaiRange
  },
  props: {
    creating: {
      type: Boolean
    }
  },
  data() {
    return {
      form: makeStoryForm({
        enabled: makeField({
          value: false
        }),
        category: makeField({
          value: 0,
          required: true
        }),
        publish_date: makeField({
          value: moment().format('L'),
          required: true,
          validators: [
            {
              v: notEmpty,
              error: this.$t('form.story.publish_date.required')
            },
            {
              v: isDate,
              error: this.$t('form.story.publish_date.invalid', {
                format: moment.localeData().longDateFormat('L')
              })
            },
          ]
        }),
        publish_time: makeField({
          value: moment().format('HH:MM'),
          required: true,
          validators: [
            {
              v: notEmpty,
              error: this.$t('form.story.publish_time.required')
            },
            {
              v: isTime,
              error: this.$t('form.story.publish_time.invalid', {
                format: 'HH:MM'
              })
            },
          ]
        }),
        end_date: makeField({
          value: null,
          validators: [
            {
              v: isDate,
              error: this.$t('form.story.end_date.invalid', {
                format: moment.localeData().longDateFormat('L')
              })
            },
          ]
        }),
        end_time: makeField({
          value: null,
          validators: [
            {
              v: isTime,
              error: this.$t('form.story.end_time.invalid', {
                format: 'HH:MM'
              })
            },
          ]
        }),
        featured: makeField({
          value: 0
        }),
        featured_end_date: makeField({
          value: null,
          validators: [
            {
              v: isDate,
              error: this.$t('form.story.featured_end_date.invalid', {
                format: moment.localeData().longDateFormat('L')
              })
            },
          ]
        }),
        featured_end_time: makeField({
          value: null,
          validators: [
            {
              v: isTime,
              error: this.$t('form.story.featured_end_time.invalid', {
                format: 'HH:MM'
              })
            },
          ]
        }),
        remark: makeField({
          value: ''
        }),
        title: makeField({
          required: true,
          value: '',
          validators: [
            {
              v: notEmpty,
              error: this.$t('form.content.title.required'),
            },
          ]
        }),
        summary: makeField({
          required: true,
          value: '',
          validators: [
            {
              v: notEmpty,
              error: this.$t('form.content.summary.required'),
            },
          ]
        }),
        content: makeField({
          value: '',
        })
      })
    };
  },
  computed: {
    title() {
      if (this.creating) return this.$t('create');
      return this.$t('update');
    },
    story() {
      return this.$store.state.news.active;
    },
    dateFormat() {
      return '(' + moment.localeData().longDateFormat('L') + ')';
    },
    categories() {
      return this.$store.getters['category/categoriesAsOptions'];
    },
    error() {
      return this.$store.state.news.error;
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
        await this.$store.dispatch('news/read', {
          id: params.id
        });
        this.form.writeForm(this.story);
      } else {
        this.$store.dispatch('news/create');
      }
    },
    async submit() {
      this.form.clearErrors();
      this.form.readForm(this.story);
      this.$store.dispatch('news/save', this.story)
        .then((story) => {
          this.$router.push({
            name: 'news.story',
            params: {
              id: story.id
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
