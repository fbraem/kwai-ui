<template>
  <PageSection>
    <HeaderLine :content="title"></HeaderLine>
    <FormulateForm
      name="page"
      v-model="form"
      ref="form"
      @submit="submit"
      @submit-raw="checkValidation"
    >
      <!-- CONTENT -->
      <KwaiFieldset :title="$t('pages.form.fieldset.content.title')">
        <template slot="description">
          {{ $t('pages.form.fieldset.content.description') }}
        </template>
        <div class="flex flex-wrap">
          <div class="w-full sm:w-auto sm:flex-grow">
            <FormulateInput
              type="text"
              name="title"
              :label="$t('pages.form.title.label')"
              :required="true"
              :placeholder="$t('pages.form.title.placeholder')"
              validation="required"
              :validation-messages="{
                required: $t('pages.form.required')
              }"
            />
          </div>
          <div class="w-full sm:w-auto sm:pl-4 self-center flex-none">
            <FormulateInput
              type="checkbox"
              name="enabled"
              :label="$t('pages.form.enabled.label')"
            />
          </div>
        </div>
        <FormulateInput
          type="textarea"
          name="summary"
          rows="5"
          validation="required"
          :label="$t('pages.form.summary.label')"
          :required="true"
          :placeholder="$t('pages.form.summary.placeholder')"
          :validation-messages="{
            required: $t('pages.form.required')
          }"
        />
        <FormulateInput
          type="textarea"
          name="content"
          rows="15"
          :label="$t('pages.form.content.label')"
          :placeholder="$t('pages.form.content.placeholder')"
        />
      </KwaiFieldset>
      <!-- APPLICATION -->
      <KwaiFieldset :title="$t('news.form.fieldset.application.title')">
        <template slot="description">
          {{ $t('pages.form.fieldset.application.description') }}
        </template>
        <FormulateInput
          name="application"
          type="select"
          :placeholder="$t('pages.form.application.placeholder')"
          :label="$t('pages.form.application.label')"
          :required="true"
          :options="applications"
          validation="required"
          :validation-messages="{
            required: $t('pages.form.required')
          }"
        />
      </KwaiFieldset>
      <!-- REMARK -->
      <KwaiFieldset :title="$t('pages.form.fieldset.remark.title')">
        <template slot="description">
          {{ $t('pages.form.fieldset.remark.description') }}
        </template>
        <FormulateInput
            type="textarea"
            name="remark"
            :label="$t('pages.form.remark.label')"
            :placeholder="$t('pages.form.remark.placeholder')"
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
        {{ $t('pages.form.validation_failed') }}
      </Alert>
      <div class="flex justify-end mt-3">
        <FormulateInput
          type="submit"
          :input-class="[
                'bg-primary', 'hover:bg-primary_dark', 'text-primary_light'
          ]"
        >
          <i
            v-if="saving"
            class="fas fa-spinner fa-spin mr-2"
          ></i>
          <i v-else class="fas fa-save mr-2"></i>
          {{ $t('pages.form.submit') }}
        </FormulateInput>
      </div>
    </FormulateForm>
  </PageSection>
</template>

<script>
import PageSection from '@/components/PageSection';
import HeaderLine from '@/components/HeaderLine';
import KwaiFieldset from '@/components/forms/KwaiFieldset';
import Alert from '@/components/Alert';

import Application from '@/models/Application';

import lang from './lang';

export default {
  components: {
    HeaderLine,
    PageSection,
    KwaiFieldset,
    Alert
  },
  i18n: lang,
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
        remark: ''
      },
      hasFormErrors: false,
      hasValidationErrors: false
    };
  },
  computed: {
    title() {
      if (this.creating) return this.$t('pages.create');
      return this.$t('pages.update');
    },
    page() {
      return this.$store.state.author.pages.current;
    },
    applications() {
      return this.$store.getters['applications/asOptions'](
        (application) => application.pages
      );
    },
    error() {
      return this.$store.state.author.news.error;
    },
    saving() {
      return this.$wait.is('author.news.save');
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async(vm) => {
      try {
        await vm.setupForm(to.params);
        return next();
      } catch (err) {
        console.log(err);
        vm.$notify({
          group: 'error',
          type: 'error',
          title: 'Unexpected error',
          text: err
        });
        return next('/author/pages');
      }
    });
  },
  async beforeRouteUpdate(to, from, next) {
    try {
      await this.setupForm(to.params);
      return next();
    } catch (err) {
      console.log(err);
      this.$notify({
        group: 'error',
        type: 'error',
        title: 'Unexpected error',
        text: err
      });
      return next('/author/pages');
    }
  },
  methods: {
    async checkValidation(submission) {
      this.hasValidationErrors = await submission.hasValidationErrors();
    },
    async setupForm(params) {
      if (params.id) {
        await this.$store.dispatch('author/pages/read', {
          id: params.id
        });
        this.form.application = this.page.application.id;
        this.form.enabled = this.page.enabled;
        this.form.remark = this.page.remark;
        this.form.title = this.page.content.title;
        this.form.summary = this.page.content.summary;
        this.form.content = this.page.content.content;
      } else {
        await this.$store.dispatch('author/pages/create');
      }
    },
    readForm() {
      this.page.enabled = this.form.enabled;
      this.page.remark = this.form.remark;
      this.page.application = new Application();
      this.page.application.id = this.form.application;
      if (!this.page.contents) {
        this.page.contents = [Object.create(null)];
      }
      this.page.contents[0].locale = 'nl';
      this.page.contents[0].format = 'md';
      this.page.contents[0].title = this.form.title;
      this.page.contents[0].summary = this.form.summary;
      this.page.contents[0].content = this.form.content;
    },
    async submit() {
      this.readForm();
      try {
        const page = await this.$store.dispatch(
          'author/pages/save',
          this.page
        );
        const route = {};
        if (this.$route.meta.back?.name) {
          route.name = this.$route.meta.back.name;
          route.params = this.$route.meta.back.params;
        } else {
          route.name = 'pages.read';
          route.params = {id: page.id};
        }
        await this.$router.push(route);
      } catch (err) {
        console.log(err);
        this.$formulate.handle(err, 'page');
        if (this.$refs.form) {
          this.hasFormErrors = this.$refs.form.mergedFormErrors.length > 0;
        }
      }
    }
  }
};
</script>
