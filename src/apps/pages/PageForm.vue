<template>
  <KwaiForm
    :title="title"
    :form="form"
    :error="error"
    :save="$t('save')"
    @submit="submit"
  >
    <KwaiFieldset title="Inhoud">
      <template slot="description">
        Geef een titel voor het artikel. De samenvatting zal in overzichten
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
            <KwaiInputText
              :placeholder="$t('form.content.title.placeholder')" />
          </KwaiField>
        </div>
        <div class="w-full sm:w-auto sm:pl-4 self-begin flex-none">
          <KwaiField
            name="enabled"
            :label="$t('form.page.enabled.label')"
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
        class="mb-3"
      >
        <KwaiTextarea
          :placeholder="$t('form.content.content.placeholder')"
          :rows="15"
        />
      </KwaiField>
    </KwaiFieldset>
    <KwaiFieldset :title="$t('form.page.category.label')">
      <template slot="description">
        Tot welke categorie behoort dit artikel?
      </template>
      <KwaiField
        name="category"
        :label="$t('form.page.category.label')"
      >
        <KwaiSelect :items="categories" />
      </KwaiField>
    </KwaiFieldset>
    <KwaiFieldset :title="$t('form.page.remark.label')">
      <template slot="description">
        Geef een eventuele opmerking in. Een opmerking is niet zichtbaar voor
        een bezoeker van de website.
      </template>
      <KwaiField name="remark" :label="$t('form.page.remark.label')">
        <KwaiTextarea
          :rows="5"
          :placeholder="$t('form.page.remark.placeholder')"
        />
      </KwaiField>
    </KwaiFieldset>
  </KwaiForm>
</template>

<script>
import Category from '@/models/Category';

import messages from './lang';

import makeForm, { makeField, notEmpty } from '@/js/Form';
const makePageForm = (fields) => {
  const writeForm = (page) => {
    fields.enabled.value = page.enabled;
    fields.remark.value = page.remark;
    fields.category.value = page.category.id;
    fields.priority.value = page.priority;

    fields.title.value = page.content.title;
    fields.summary.value = page.content.summary;
    fields.content.value = page.content.content;
  };
  const readForm = (page) => {
    page.enabled = fields.enabled.value;
    page.remark = fields.remark.value;
    page.category = new Category();
    page.category.id = fields.category.value;
    page.priority = fields.priority.value;

    if (!page.contents) {
      page.contents = [ Object.create(null) ];
    }
    page.contents[0].title = fields.title.value;
    page.contents[0].summary = fields.summary.value;
    page.contents[0].content = fields.content.value;
  };
  return {
    ...makeForm(fields),
    writeForm,
    readForm
  };
};

import KwaiForm from '@/components/forms/KwaiForm';
import KwaiFieldset from '@/components/forms/KwaiFieldset';
import KwaiField from '@/components/forms/KwaiField';
import KwaiInputText from '@/components/forms/KwaiInputText';
import KwaiSelect from '@/components/forms/KwaiSelect';
import KwaiTextarea from '@/components/forms/KwaiTextarea';
import KwaiSwitch from '@/components/forms/KwaiSwitch';

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
  },
  props: {
    creating: {
      type: Boolean
    }
  },
  data() {
    return {
      form: makePageForm({
        enabled: makeField({
          value: true
        }),
        category: makeField({
          value: null,
          required: true,
          validators: [
            {
              v: notEmpty,
              error: this.$t('form.page.category.required'),
            },
          ]
        }),
        priority: makeField({
          value: 0,
          required: true
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
          required: true,
          validators: [
            {
              v: notEmpty,
              error: this.$t('form.content.content.required'),
            },
          ]
        })
      })
    };
  },
  computed: {
    title() {
      if (this.creating) return this.$t('create');
      return this.$t('update');
    },
    page() {
      return this.$store.state.page.active;
    },
    error() {
      return this.$store.state.page.error;
    },
    categories() {
      return this.$store.getters['category/categoriesAsOptions'];
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
        await this.$store.dispatch('page/read', {
          id: params.id
        });
        this.form.writeForm(this.page);
      } else {
        this.$store.dispatch('page/create');
      }
    },
    async submit() {
      this.form.clearErrors();
      this.form.readForm(this.page);
      try {
        await this.$store.dispatch('page/save', this.page);
        this.$router.push({
          name: 'pages.read',
          params: {
            id: this.page.id
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
