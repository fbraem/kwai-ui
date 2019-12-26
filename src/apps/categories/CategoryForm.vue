<template>
  <div class="container mx-auto my-3">
    <KwaiForm
      :form="form"
      :title="$t('category')"
      :error="error"
      :save="$t('save')"
      @submit="submit"
    >
      <KwaiFieldset :title="$t('category')">
        <template slot="description">
          Geef de categorie een naam. De korte omschrijving zal gebruikt
          als de categorie in een lijst wordt getoond. De omschrijving zal op
          de start pagina van de categorie getoond worden.
        </template>
        <KwaiField
          name="name"
          class="mb-3"
          :label="$t('form.name.label')"
        >
          <KwaiInputText :placeholder="$t('form.name.placeholder')" />
        </KwaiField>
        <KwaiField
          name="short_description"
          class="mb-3"
          :label="$t('form.short_description.label')"
        >
          <KwaiTextarea
            :placeholder="$t('form.short_description.placeholder')" />
        </KwaiField>
        <KwaiField
          name="description"
          :label="$t('form.description.label')"
        >
          <KwaiTextarea
            :placeholder="$t('form.description.placeholder')"
            :rows="5"
          />
        </KwaiField>
      </KwaiFieldset>
      <KwaiFieldset :title="$t('form.app.label')">
        <template slot="description">
          Een categorie kan aan een app gekoppeld worden. Wanneer naar deze
          categorie gesurfd wordt, dan zal de gebruiker door gestuurd worden
          naar deze app.
        </template>
        <KwaiField
          name="app"
          :label="$t('form.app.label')"
        >
          <KwaiInputText :placeholder="$t('form.app.placeholder')" />
        </KwaiField>
      </KwaiFieldset>
      <KwaiFieldset :title="$t('form.remark.label')">
        <template slot="description">
          Geef eventueel nog een opmerking in over deze categorie. Een
          opmerking zal niet getoond worden aan een bezoeker van de website.
        </template>
        <KwaiField
          name="remark"
        >
          <KwaiTextarea
            :label="$t('form.app.label')"
            :placeholder="$t('form.remark.placeholder')"
            :rows="5"
          />
        </KwaiField>
      </KwaiFieldset>
    </KwaiForm>
  </div>
</template>

<script>
import makeForm, { makeField, notEmpty } from '@/js/Form.js';
import KwaiForm from '@/components/forms/KwaiForm';
import KwaiFieldset from '@/components/forms/KwaiFieldset';
import KwaiField from '@/components/forms/KwaiField';
import KwaiInputText from '@/components/forms/KwaiInputText';
import KwaiTextarea from '@/components/forms/KwaiTextarea';

const makeCategoryForm = (fields) => {
  const writeForm = (category) => {
    fields.name.value = category.name;
    fields.app.value = category.app;
    fields.description.value = category.description;
    fields.remark.value = category.remark;
    fields.short_description.value = category.short_description;
  };
  const readForm = (category) => {
    category.name = fields.name.value;
    category.app = fields.app.value;
    category.description = fields.description.value;
    category.remark = fields.remark.value;
    category.short_description = fields.short_description.value;
  };
  return { ...makeForm(fields), writeForm, readForm };
};

import messages from './lang';

/**
 * Component for creating or updating a category
 */
export default {
  components: {
    KwaiForm,
    KwaiFieldset,
    KwaiInputText,
    KwaiTextarea,
    KwaiField
  },
  i18n: messages,
  data() {
    return {
      form: makeCategoryForm({
        name: makeField({
          required: true,
          validators: [
            {
              v: notEmpty,
              error: this.$t('form.name.required'),
            },
          ]
        }),
        app: makeField(),
        description: makeField(),
        remark: makeField(),
        short_description: makeField({
          required: true,
          validators: [
            {
              v: notEmpty,
              error: this.$t('form.short_description.required'),
            },
          ]
        }),
      })
    };
  },
  computed: {
    category() {
      return this.$store.state.category.active;
    },
    error() {
      return this.$store.state.category.error;
    },
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
        await this.$store.dispatch('category/read', {
          id: params.id
        });
        this.form.writeForm(this.category);
      } else {
        this.$store.dispatch('category/create');
      }
    },
    submit() {
      this.form.clearErrors();
      this.form.readForm(this.category);
      this.$store.dispatch('category/save', this.category)
        .then((newCategory) => {
          this.$router.push({
            name: 'categories.read',
            params: { id: newCategory.id }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
