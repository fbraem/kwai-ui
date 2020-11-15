<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <ApplicationHeader :content="$t('categories')" />
    </PageHeader>
    <PageSection>
      <HeaderLine :content="title" />
      <FormulateForm
        name="category"
        v-model="form"
        @submit="submit"
        @submit-raw="checkValidation"
        class="w-full"
      >
        <KwaiFieldset :title="$t('form.team_category.fieldset.name.title')">
          <template slot="description">
            {{ $t('form.team_category.fieldset.name.description')}}
          </template>
          <div class="w-full">
            <FormulateInput
              name="name"
              :label="$t('form.team_category.name.label')"
              :required="true"
              :placeholder="$t('form.team_category.name.placeholder')"
              validation="required"
              :validation-messages="{
                required: $t('form.team_category.required')
              }"
            >
            </FormulateInput>
          </div>
        </KwaiFieldset>
        <KwaiFieldset :title="$t('form.team_category.fieldset.requirements.title')">
          <template slot="description">
            {{ $t('form.team_category.fieldset.requirements.description')}}
          </template>
          <div class="w-full flex flex-wrap justify-between">
            <div class="md:pr-6 w-full md:w-1/2 mb-4">
              <FormulateInput
                name="start_age"
                :label="$t('form.team_category.start_age.label')"
                :placeholder="$t('form.team_category.start_age.placeholder')"
              >
              </FormulateInput>
            </div>
            <div class="w-full md:w-1/2 mb-4">
              <FormulateInput
                name="end_age"
                :label="$t('form.team_category.end_age.label')"
                :placeholder="$t('form.team_category.end_age.placeholder')"
              >
              </FormulateInput>
            </div>
          </div>
          <div class="w-full">
            <FormulateInput
              name="gender"
              type="select"
              :placeholder="$t('form.team_category.gender.placeholder')"
              :label="$t('form.team_category.gender.label')"
              :options="genders"
            ></FormulateInput>
          </div>
        </KwaiFieldset>
        <KwaiFieldset :title="$t('form.team_category.fieldset.competition.title')">
          <template slot="description">
            {{ $t('form.team_category.fieldset.competition.description') }}
          </template>
          <FormulateInput
            name="competition"
            type="checkbox"
            :label="$t('form.team_category.competition.label')"
          />
        </KwaiFieldset>
        <KwaiFieldset :title="$t('form.team_category.fieldset.active.title')">
          <template slot="description">
            {{ $t('form.team_category.fieldset.active.description') }}
          </template>
          <FormulateInput
            name="active"
            type="checkbox"
            :label="$t('form.team_category.active.label')"
          />
        </KwaiFieldset>
        <KwaiFieldset :title="$t('form.team_category.fieldset.remark.title')">
          <template slot="description">
            {{ $t('form.team_category.fieldset.remark.description')}}
          </template>
          <FormulateInput
            type="textarea"
            name="remark"
            :label="$t('form.team_category.remark.label')"
            :placeholder="$t('form.team_category.remark.placeholder')"
            :rows="5"
          />
        </KwaiFieldset>
        <div class="flex justify-end mt-3">
          <FormulateInput
            type="submit"
            :input-class="['bg-primary', 'hover:bg-primary_dark', 'text-primary_light']"
          >
            <i
              v-if="categories.save.isRunning"
              class="fas fa-spinner fa-spin mr-2"
            ></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ $t('form.team_category.submit') }}
          </FormulateInput>
        </div>
      </FormulateForm>
    </PageSection>
  </div>
</template>

<script>
import messages from './lang';
import PageHeader from '@/components/PageHeader.vue';
import PageSection from '@/components/PageSection.vue';
import ApplicationHeader from '@/components/ApplicationHeader.vue';
import HeaderLine from '@/components/HeaderLine.vue';
import KwaiFieldset from '@/components/forms/KwaiFieldset.vue';
import {useTeamCategoryStore} from '@/apps/teams/composables/useTeamCategories';
// eslint-disable-next-line max-len
import {computed, getCurrentInstance, onMounted, reactive, ref, watch} from '@vue/composition-api';
import TeamCategory from '@/models/TeamCategory';

export default {
  props: {
    id: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const categories = useTeamCategoryStore();

    const vm = getCurrentInstance();

    const form = ref({
      name: '',
      start_age: null,
      end_age: null,
      gender: 0,
      active: true,
      competition: true,
      remark: ''
    });
    let hasFormErrors = ref(false);
    let hasValidationErrors = ref(false);

    if (props.id) {
      onMounted(async() => {
        await categories.read.run(props.id);
        if (categories.current) {
          form.value.name = categories.current.name;
          form.value.start_age = categories.current.start_age;
          form.value.end_age = categories.current.end_age;
          form.value.gender = categories.current.gender;
          form.value.active = categories.current.active;
          form.value.competition = categories.current.competition;
          form.value.remark = categories.current.remark;
        }
      });
      watch(() => props.id, (newValue) => {
        categories.read.run(newValue);
      });
    }
    async function checkValidation(submission) {
      hasValidationErrors.value = await submission.hasValidationErrors();
    }

    async function submit() {
      const category = props.id ? categories.current : new TeamCategory();
      category.name = form.value.name;
      category.start_age = form.value.start_age;
      category.end_age = form.value.end_age;
      category.gender = form.value.gender;
      category.active = form.value.active;
      category.competition = form.value.competition;
      category.remark = form.value.remark;

      await categories.save.run(category);
      if (!categories.save.error) {
        await vm.$router.push({
          name: 'team_categories.read',
          params: {
            id: categories.current.id
          }
        });
      } else {
        console.log(categories.save.error);
      }
    }

    const title = computed(() => {
      return props.id ? vm.$t('update_category') : vm.$t('create_category');
    });

    const genders = ref({
      0: vm.$t('no_restriction'),
      1: vm.$t('male'),
      2: vm.$t('female')
    });

    return {
      categories: reactive(categories),
      form,
      hasFormErrors,
      hasValidationErrors,
      checkValidation,
      submit,
      title,
      genders
    };
  },
  components: {
    KwaiFieldset,
    HeaderLine,
    PageHeader,
    PageSection,
    ApplicationHeader,
  },
  i18n: messages
};
</script>
