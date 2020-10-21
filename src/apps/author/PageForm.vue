<template>
  <PageSection>
    <HeaderLine :content="title"></HeaderLine>
    <FormulateForm
      name="page"
      v-model="form"
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
            v-if="store.save.isRunning"
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
import {useAuthorPageStore} from '@/apps/author/composables/usePages';
// eslint-disable-next-line max-len
import {computed, getCurrentInstance, onMounted, reactive, ref} from '@vue/composition-api';
import Page from '@/components/Page';

export default {
  props: {
    id: {
      type: String
    }
  },
  setup(props) {
    const store = useAuthorPageStore();

    const form = ref({
      title: '',
      enabled: false,
      summary: '',
      content: '',
      application: 0,
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
        form.value.remark = store.current.remark;
        form.value.title = store.current.content.title;
        form.value.summary = store.current.content.summary;
        form.value.content = store.current.content.content;
      });
    }

    async function submit() {
      const page = props.id ? store.current : new Page();
      page.enabled = form.value.enabled;
      page.remark = form.value.remark;
      page.application = new Application();
      page.application.id = form.value.application;
      if (!page.contents) {
        page.contents = [Object.create(null)];
      }
      page.contents[0].locale = 'nl';
      page.contents[0].format = 'md';
      page.contents[0].title = form.value.title;
      page.contents[0].summary = form.value.summary;
      page.contents[0].content = form.value.content;

      await store.save.run(page);
      if (!store.save.error) {
        await vm.$router.push({
          name: 'pages.read',
          params: {
            id: store.current.id
          }
        });
      } else {
        this.$formulate.handle(store.save.error, 'page');
        console.log(store.save.error);
      }
    }

    const vm = getCurrentInstance();
    const title = computed(() =>
      props.id ? vm.$t('pages.create') : vm.$t('pages.update')
    );

    return {
      store: reactive(store),
      form,
      hasFormErrors,
      hasValidationErrors,
      checkValidation,
      title,
      submit
    };
  },
  components: {
    HeaderLine,
    PageSection,
    KwaiFieldset,
    Alert
  },
  i18n: lang,
  computed: {
    applications() {
      return this.$store.getters['applications/asOptions'](
        (application) => application.pages
      );
    }
  }
};
</script>
