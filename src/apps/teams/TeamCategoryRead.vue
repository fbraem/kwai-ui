<template>
  <div>
    <PageHeader>
      <div class="flex flex-wrap justify-between">
        <div>
          <ApplicationHeader :content="$t('teams')" />
          <div v-if="category">
            <h2>{{ category.name }}</h2>
          </div>
        </div>
      </div>
    </PageHeader>
    <PageSection>
      <Spinner
        class="w-full text-center"
        v-if="categories.read.isRunning"
      />
      <Alert
        v-else-if="!category"
        type="danger"
      >
        {{ $t('not_found') }}
      </Alert>
      <Attributes
        v-if="category"
        :attributes="attributes"
        :title="$t('category')"
        :description="category.name"
      >
        <template v-slot:value_competition="{ attribute }">
          <i
            class="fas fa-check"
            :class="{
              'fa-check': attribute.value,
              'fa-times': !attribute.value,
              'text-red-700': !attribute.value
            }"
          >
          </i>
        </template>
        <template v-slot:value_active="{ attribute }">
          <i
            class="fas fa-check"
            :class="{
              'fa-check': attribute.value,
              'fa-times': !attribute.value,
              'text-red-700': !attribute.value
            }"
          >
          </i>
        </template>
        <div class="text-xs flex flex-wrap items-baseline mt-3">
          <div class="mx-2">
            <strong>Aangemaakt:</strong> {{ category.localCreatedAt }}
          </div>
          <div class="mx-2">
            <strong>Laatst gewijzigd:</strong> {{ category.localUpdatedAt }}
          </div>
        </div>
      </Attributes>
      <div class="w-full mt-2 flex flex-row justify-end">
        <IconLink
          class="hover:bg-body_dark text-body"
          icon="fas fa-list"
          :route="{ name: 'team_categories.browse' }"
        />
        <IconLink
          v-if="category && canUpdate"
          class="hover:bg-body_dark text-body"
          icon="fas fa-edit"
          :route="{
            name: 'team_categories.update',
            params: {
              id: category.id
            }
          }"
        />
      </div>
    </PageSection>
  </div>
</template>

<script>
import messages from './lang';

import Spinner from '@/components/Spinner';
import Alert from '@/components/Alert';
import PageHeader from '@/components/PageHeader';
import PageSection from '@/components/PageSection';
import ApplicationHeader from '@/components/ApplicationHeader';
import Attributes from '@/components/Attributes';
import useTeamCategoryStore from '@/apps/teams/composables/useTeamCategories';
// eslint-disable-next-line max-len
import {onMounted, watch, reactive, computed, getCurrentInstance} from '@vue/composition-api';
import IconLink from '@/components/IconLink';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const vm = getCurrentInstance();
    const categories = useTeamCategoryStore();

    onMounted(() => {
      categories.read.run(props.id);
    });
    const category = computed(() => categories.current);
    watch(() => props.id, (newValue) => {
      categories.read.run(newValue);
    });

    const attributes = computed(() => {
      let gender = '';
      if (category.value.gender === 0) {
        gender = vm.$t('no_restriction');
      } else if (category.value.gender === 1) {
        gender = vm.$t('male');
      } else {
        gender = vm.$t('female');
      }
      return {
        name: {
          label: vm.$t('name'),
          value: category.value.name,
        },
        age: {
          label: vm.$t('age'),
          value: `${category.value.start_age} - ${category.value.end_age}`
        },
        gender: {
          label: vm.$t('gender'),
          value: gender
        },
        competition: {
          label: vm.$t('competition'),
          value: category.value.competition
        },
        active: {
          label: vm.$t('active'),
          value: category.value.active
        }
      };
    });

    const canUpdate = computed(() => {
      return vm.$can('update', category);
    });

    return {
      categories: reactive(categories),
      category,
      attributes,
      canUpdate
    };
  },
  i18n: messages,
  components: {
    IconLink,
    Spinner, Alert, PageHeader, PageSection, ApplicationHeader, Attributes
  }
};
</script>
