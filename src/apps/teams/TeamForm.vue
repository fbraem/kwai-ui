<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <ApplicationHeader :content="$t('teams')" />
    </PageHeader>
    <PageSection>
      <HeaderLine :content="title" />
      <FormulateForm
        name="team"
        v-model="form"
        ref="form"
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
            name="season"
            type="select"
            :placeholder="$t('form.team.season.placeholder')"
            :label="$t('form.team.season.label')"
            :options="seasonOptions"
          ></FormulateInput>
        </KwaiFieldset>
        <KwaiFieldset :title="$t('form.team.fieldset.category.title')">
          <template slot="description">
            {{ $t('form.team.fieldset.category.description') }}
          </template>
          <FormulateInput
            name="category"
            type="select"
            :placeholder="$t('form.team.category.placeholder')"
            :label="$t('form.team.category.label')"
            :options="categoryOptions"
          ></FormulateInput>
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
        <div class="flex justify-end mt-3">
          <FormulateInput
            type="submit"
            :input-class="['bg-primary', 'hover:bg-primary_dark', 'text-primary_light']"
          >
            <i
              v-if="teams.saving"
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

import messages from './lang';

import PageHeader from '@/components/PageHeader';
import ApplicationHeader from '@/components/ApplicationHeader';
import PageSection from '@/components/PageSection';
import HeaderLine from '@/components/HeaderLine';
import KwaiFieldset from '@/components/forms/KwaiFieldset';

import { useTeamStore } from '@/apps/teams/composables/useTeams';
import { useSeasonStore } from '@/apps/seasons/composables/useSeasons';
// eslint-disable-next-line max-len
import { useTeamCagegoryStore } from '@/apps/teams/composables/useTeamCategories';
import Team from '@/models/Team';

export default {
  props: {
    id: {
      required: false
    }
  },
  setup(props) {
    const teams = useTeamStore();
    const seasons = useSeasonStore();
    const categories = useTeamCagegoryStore();

    return {
      teams,
      seasons,
      categories
    };
  },
  components: {
    ApplicationHeader,
    KwaiFieldset,
    HeaderLine,
    PageSection,
    PageHeader
  },
  i18n: messages,
  data() {
    return {
      hasValidationErrors: false,
      hasFormErrors: false,
      form: {
        name: '',
        season: 0,
        category: 0,
        remark: ''
      }
    };
  },
  async mounted() {
    await this.seasons.load.run();
    await this.categories.load.run();
    if (this.id) {
      await this.teams.read.run(this.id);
      this.form.name = this.teams.current.name;
      this.form.season = this.teams.current.season?.id ?? 0;
      this.form.category = this.teams.current.team_category?.id ?? 0;
      this.form.remark = this.teams.current.remark;
    }
  },
  computed: {
    title() {
      return this.id ? this.$t('update') : this.$t('create');
    },
    seasonOptions() {
      const seasons = this.seasons.asOptions;
      seasons[0] = this.$t('form.team.season.empty');
      return seasons;
    },
    categoryOptions() {
      const categories = this.categories.asOptions;
      categories[0] = this.$t('form.team.category.empty');
      return categories;
    },
  },
  methods: {
    async checkValidation(submission) {
      this.hasValidationErrors = await submission.hasValidationErrors();
    },
    async submit() {
      const team = this.id ? this.teams.current : new Team();
      team.name = this.form.name;
      if (this.form.season) {
        team.season = new Season(this.form.season);
      }
      if (this.form.category) {
        team.category = new TeamCategory(this.form.category);
      }
      team.remark = this.form.remark;
      await this.teams.save.run(team);
      if (!this.teams.save.error) {
        await this.$router.push({
          name: 'teams.read',
          params: {
            id: this.teams.current.id
          }
        });
      } else {
        console.log(this.teams.save.error);
      }
    }
  }
};
</script>
