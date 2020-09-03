<template>
  <!-- eslint-disable max-len -->
  <PageSection>
    <HeaderLine :content="title" />
    <FormulateForm
      name="coach"
      v-model="form"
      @submit="submit"
      @submit-raw="checkValidation"
      class="w-full"
    >
      <KwaiFieldset :title="$t('training.coaches.form.fieldset.coach.title')">
        <template slot="description">
          {{ $t('training.coaches.form.fieldset.coach.description') }}
        </template>
        <div class="w-full">
          <FormulateInput
            v-if="!id"
            type="kwaiautocomplete"
            name="member"
            :required="true"
            :options="membersAsOptions"
            :label="$t('training.coaches.form.member.label')"
            validation="required"
            :validation-messages="{
                required: $t('required')
              }"
          >
          </FormulateInput>
          <div
            v-else
            class="font-bold text-xl"
          >
            {{ form.member }}
          </div>
        </div>
      </KwaiFieldset>
      <KwaiFieldset :title="$t('training.coaches.form.fieldset.information.title')">
        <template slot="description">
          {{ $t('training.coaches.form.fieldset.information.description')}}
        </template>
        <FormulateInput
          type="text"
          name="diploma"
          :label="$t('training.coaches.form.diploma.label')"
          :placeholder="$t('training.coaches.form.diploma.placeholder')"
          :rows="5"
        />
        <FormulateInput
          type="textarea"
          name="description"
          :label="$t('training.coaches.form.description.label')"
          :placeholder="$t('training.coaches.form.description.placeholder')"
          :rows="5"
        />
      </KwaiFieldset>
      <KwaiFieldset :title="$t('training.coaches.form.fieldset.active.title')">
        <template slot="description">
          {{ $t('training.coaches.form.fieldset.active.description') }}
        </template>
        <FormulateInput
          name="active"
          type="checkbox"
          :label="$t('training.coaches.form.active.label')"
        />
      </KwaiFieldset>
      <KwaiFieldset :title="$t('training.coaches.form.fieldset.remark.title')">
        <template slot="description">
          {{ $t('training.coaches.form.fieldset.remark.description')}}
        </template>
        <FormulateInput
          type="textarea"
          name="remark"
          :label="$t('training.coaches.form.remark.label')"
          :placeholder="$t('training.coaches.form.remark.placeholder')"
          :rows="5"
        />
      </KwaiFieldset>
      <Alert v-if="hasFormErrors">
        <FormulateErrors />
      </Alert>
      <div class="flex justify-end mt-3">
        <FormulateInput
          type="submit"
          :input-class="[
              'bg-primary', 'hover:bg-primary_dark', 'text-primary_light'
            ]"
        >
          <i
            v-if="coaches.save.isRunning"
            class="fas fa-spinner fa-spin mr-2"
          ></i>
          <i v-else class="fas fa-save mr-2"></i>
          {{ $t('save') }}
        </FormulateInput>
      </div>
    </FormulateForm>
  </PageSection>
</template>

<script>

import PageSection from '@/components/PageSection';
import HeaderLine from '@/components/HeaderLine';

import messages from './lang';
import KwaiFieldset from '@/components/forms/KwaiFieldset';
import {useCoachStore} from '@/apps/trainings/composables/useCoaches';
import createMemberService from '@/apps/members/composables/useMembers';
// eslint-disable-next-line max-len
import {onMounted, reactive, ref, computed, getCurrentInstance} from '@vue/composition-api';
import Coach from '@/models/trainings/Coach';
import Member from '@/models/Member';

export default {
  props: {
    id: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const vm = getCurrentInstance();

    const coaches = useCoachStore();
    const members = createMemberService();

    const form = ref({
      member: '',
      description: '',
      diploma: '',
      active: true,
      remark: ''
    });
    if (props.id) {
      onMounted(async() => {
        await coaches.read.run(props.id);
        form.value.member = coaches.current.member.name;
        form.value.description = coaches.current.description;
        form.value.remark = coaches.current.remark;
        form.value.active = coaches.current.active;
        form.value.diploma = coaches.current.diploma;
      });
    }
    let hasFormErrors = ref(false);
    let hasValidationErrors = ref(false);

    const title = computed(() =>
      props.id ? vm.$t('training.coaches.update')
        : vm.$t('training.coaches.create')
    );

    onMounted(() => {
      members.load.run();
    });
    const membersAsOptions = computed(() => {
      const options = {};
      for (const m of members.all) {
        options[m.id] = m.name;
      }
      return options;
    });

    async function checkValidation(submission) {
      hasValidationErrors.value = await submission.hasValidationErrors();
    }

    async function submit() {
      const coach = props.id ? coaches.current : new Coach();
      if (!props.id) {
        coach.member = new Member(form.value.member.value);
      }
      coach.description = form.value.description;
      coach.diploma = form.value.diploma;
      coach.active = form.value.active;
      coach.remark = form.value.remark;

      await coaches.save.run(coach);
      if (!coaches.save.error) {
        await vm.$router.push({
          name: 'trainings.coaches.read',
          params: {
            id: coaches.current.id
          }
        });
      } else {
        console.log(coaches.save.error);
      }
    }

    return {
      coaches: reactive(coaches),
      form,
      hasValidationErrors,
      hasFormErrors,
      checkValidation,
      submit,
      members: reactive(members),
      membersAsOptions,
      title
    };
  },
  components: {
    KwaiFieldset,
    PageSection,
    HeaderLine
  },
  i18n: messages
};
</script>
