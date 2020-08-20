<template>
  <div>
    <PageHeader>
      <ApplicationHeader :content="$t('teams')" />
    </PageHeader>
    <PageSection>
      <HeaderLine :content="title" />
      {{ teams.read.isRunning }}
      <FormulateForm
        name="team"
        v-model="form"
        @submit="submit"
        @submit-raw="checkValidation"
        class="w-full"
      >
        <KwaiFieldset :title="$t('form.team.fieldset.team.title')">
          <template slot="description">
            {{ $t('form.team.fieldset.team.description') }}
          </template>
          <div class="w-full">
            <FormulateInput
              name="name"
              :label="$t('form.team.name.label')"
              :required="true"
              :placeholder="$t('form.team.name.placeholder')"
              validation="required"
              :validation-messages="{
                required: $t('form.team.required')
              }"
            >
            </FormulateInput>
          </div>
        </KwaiFieldset>
        <KwaiFieldset :title="$t('form.team.fieldset.season.title')">
          <template slot="description">
            {{ $t('form.team.fieldset.season.description') }}
          </template>
          <FormulateInput
            v-if="Object.keys(seasonOptions).length > 1"
            name="season"
            type="select"
            :placeholder="$t('form.team.season.placeholder')"
            :label="$t('form.team.season.label')"
            :options="seasonOptions"
          ></FormulateInput>
          <div
            v-else-if="!seasons.load.isRunning"
            class="sm:flex sm:items-center sm:justify-between"
          >
            <div class="flex-1 min-w-0">
              {{ $t('form.team.no_season') }}
            </div>
            <div class="mt-5 flex sm:mt-0 sm:ml-4">
              <IconButton
                v-if="canCreateSeason"
                class="bg-primary text-primary_light"
                icon="fas fa-plus"
                :content="$t('create_season')"
                :route="{ name: 'seasons.create' }"
              />
            </div>
          </div>
        </KwaiFieldset>
        <KwaiFieldset :title="$t('form.team.fieldset.category.title')">
          <template slot="description">
            {{ $t('form.team.fieldset.category.description') }}
          </template>
          <FormulateInput
            v-if="Object.keys(categoryOptions).length > 1"
            name="category"
            type="select"
            :placeholder="$t('form.team.category.placeholder')"
            :label="$t('form.team.category.label')"
            :options="categoryOptions"
          ></FormulateInput>
          <div
            v-else-if="!categories.load.isRunning"
            class="sm:flex sm:items-center sm:justify-between"
          >
            <div class="flex-1 min-w-0">
              {{ $t('form.team.no_category') }}
            </div>
            <div class="mt-5 flex sm:mt-0 sm:ml-4">
              <IconButton
                v-if="canCreateCategory"
                class="bg-primary text-primary_light"
                icon="fas fa-plus"
                :content="$t('create_category')"
                :route="{ name: 'team_categories.create' }"
              />
            </div>
          </div>
        </KwaiFieldset>
        <KwaiFieldset :title="$t('form.team.fieldset.remark.title')">
          <template slot="description">
            {{ $t('form.team.fieldset.remark.description')}}
          </template>
          <FormulateInput
            type="textarea"
            name="remark"
            :label="$t('form.team.remark.label')"
            :placeholder="$t('form.team.remark.placeholder')"
            :rows="5"
          />
        </KwaiFieldset>
        <Alert v-if="hasFormErrors">
          <FormulateErrors />
          {{ $t('login.form.contact') }}
        </Alert>
        <div class="flex justify-end mt-3">
          <FormulateInput
            type="submit"
            :input-class="[
              'bg-primary', 'hover:bg-primary_dark', 'text-primary_light'
            ]"
          >
            <i
              v-if="teams.save.isRunning"
              class="fas fa-spinner fa-spin mr-2"
            ></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ $t('form.team.submit') }}
          </FormulateInput>
        </div>
      </FormulateForm>
    </PageSection>
  </div>
</template>

<script>
import TeamCategory from '@/models/TeamCategory';
import Season from '@/models/Season';
import Team from '@/models/Team';

import messages from './lang';

import PageHeader from '@/components/PageHeader';
import ApplicationHeader from '@/components/ApplicationHeader';
import PageSection from '@/components/PageSection';
import HeaderLine from '@/components/HeaderLine';
import KwaiFieldset from '@/components/forms/KwaiFieldset';
import Alert from '@/components/Alert';

import {useTeamStore} from '@/apps/teams/composables/useTeams';
import {useSeasonStore} from '@/apps/seasons/composables/useSeasons';
import {useTeamCagegoryStore} from '@/apps/teams/composables/useTeamCategories';
// eslint-disable-next-line max-len
import {computed, getCurrentInstance, onMounted, reactive, ref} from '@vue/composition-api';
import IconButton from '@/components/IconButton';

export default {
  props: {
    id: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const teams = useTeamStore();
    const seasons = useSeasonStore();
    const categories = useTeamCagegoryStore();

    const vm = getCurrentInstance();

    const form = ref({
      name: '',
      season: 0,
      category: 0,
      remark: ''
    });
    let hasFormErrors = ref(false);
    let hasValidationErrors = ref(false);

    // When an id is passed, get the team and fill in the form.
    if (props.id) {
      onMounted(async() => {
        await teams.read.run(props.id);
        if (teams.current) {
          form.value.name = teams.current.name;
          form.value.season = teams.current.season?.id ?? 0;
          form.value.category = teams.current.team_category?.id ?? 0;
          form.value.remark = teams.current.remark;
        }
      });
    }

    async function checkValidation(submission) {
      hasValidationErrors.value = await submission.hasValidationErrors();
    }

    async function submit() {
      const team = props.id ? teams.current : new Team();
      team.name = form.value.name;
      if (form.value.season) {
        team.season = new Season(form.value.season);
      }
      if (form.value.category) {
        team.category = new TeamCategory(form.value.category);
      }
      team.remark = form.value.remark;

      await teams.save.run(team);
      if (!teams.save.error) {
        await vm.$router.push({
          name: 'teams.read',
          params: {
            id: teams.current.id
          }
        });
      } else {
        console.log(teams.save.error);
      }
    }

    const title = computed(() => {
      return props.id ? vm.$t('update') : vm.$t('create');
    });

    const seasonOptions = computed(() => {
      const options = seasons.asOptions;
      options[0] = vm.$t('form.team.season.empty');
      return options;
    });
    const canCreateSeason = computed(() => {
      return vm.$can('create', Season.type());
    });

    const categoryOptions = computed(() => {
      const options = categories.asOptions;
      options[0] = vm.$t('form.team.category.empty');
      return options;
    });
    const canCreateCategory = computed(() => {
      return vm.$can('create', TeamCategory.type());
    });

    onMounted(async() => {
      await seasons.load.run();
      await categories.load.run();
    });

    return {
      teams: reactive(teams),
      seasons: reactive(seasons),
      categories: reactive(categories),
      form,
      hasValidationErrors,
      hasFormErrors,
      checkValidation,
      submit,
      title,
      seasonOptions,
      canCreateSeason,
      categoryOptions,
      canCreateCategory,
    };
  },
  components: {
    IconButton,
    Alert,
    ApplicationHeader,
    KwaiFieldset,
    HeaderLine,
    PageSection,
    PageHeader
  },
  i18n: messages,
};
</script>
