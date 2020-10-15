<template>
  <div class="mt-6 container mx-auto">
    <FormulateForm
      name="ability"
      v-model="form"
      @submit="submit"
      @submit-raw="checkValidation"
      class="w-full"
    >
      <KwaiFieldset
       title="Toelating"
      >
        <div class="w-full">
          <FormulateInput
            name="name"
            :label="$t('rules.form.name.label')"
            :required="true"
            :placeholder="$t('rules.form.name.placeholder')"
            validation="required"
            :validation-messages="{
              required: 'Dit veld is verplicht in te vullen'
            }"
          >
          </FormulateInput>
        </div>
        <div class="w-full">
          <FormulateInput
            type="kwaimulti"
            name="rules"
            :options="rules"
            :label="$t('rules.form.rules.label')"
            group-values="actions"
            group-label="subject"
            multi-label="name"
            track-by="id"
            :multiple="true"
            :close-on-select="false"
            :selectLabel="$t('rules.form.rules.selectLabel')"
            :deselectLabel="$t('rules.form.rules.deselectLabel')"
            validation="required"
            :validation-messages="{
              required: 'Dit veld is verplicht in te vullen'
            }"
          >
          </FormulateInput>
        </div>
        <div class="w-full">
          <FormulateInput
            type="textarea"
            name="remark"
            :label="$t('rules.form.remark.label')"
            :placeholder="$t('rules.form.remark.placeholder')"
            :rows="5"
          />
        </div>
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
              v-if="abilityStore.save.isRunning"
              class="fas fa-spinner fa-spin mr-2"
            ></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ $t('save') }}
          </FormulateInput>
        </div>
      </KwaiFieldset>
    </FormulateForm>
  </div>
</template>

<script>
import {onMounted, reactive, ref, computed, getCurrentInstance} from '@vue/composition-api';

import messages from './lang';
import {useRuleStore} from '@/apps/users/composables/useRules';
import {useAbilityStore} from '@/apps/users/composables/useAbilities';
import KwaiFieldset from '@/components/forms/KwaiFieldset';
import Alert from '@/components/Alert';
import Ability from '@/models/users/Ability';
import Rule from '@/models/users/Rule';

export default {
  props: {
    id: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const abilityStore = useAbilityStore();
    const ruleStore = useRuleStore();

    const form = ref({
      name: '',
      remark: '',
      rules: []
    });
    let hasFormErrors = ref(false);
    let hasValidationErrors = ref(false);

    async function checkValidation(submission) {
      hasValidationErrors.value = await submission.hasValidationErrors();
    }

    const vm = getCurrentInstance();
    async function submit() {
      const ability = props.id ? abilityStore.current : new Ability();
      ability.name = form.value.name;
      ability.remark = form.value.remark;
      ability.rules = form.value.rules.map(value => new Rule(value.id));
      await abilityStore.save.run(ability);
      if (!abilityStore.save.error) {
        await vm.$router.push({
          name: 'users.abilities.browse'
        });
      } else {
        console.log(abilityStore.save.error);
      }
    }

    onMounted(async() => {
      await abilityStore.read.run(props.id);
      if (abilityStore.current) {
        form.value.name = abilityStore.current.name;
        form.value.remark = abilityStore.current.remark;
        form.value.rules = abilityStore.current.rules;
      }
    });

    onMounted(() => ruleStore.load.run());
    const rules = computed(() => {
      const options = [];
      for (let rule of Object.values(ruleStore.all)) {
        let option = options.find((r) => {
          return r.subject === rule.subject;
        });
        if (!option) {
          option = {
            subject: rule.subject,
            actions: []
          };
          options.push(option);
        }
        option.actions.push({
          name: rule.name,
          id: rule.id,
          action: rule.action,
        });
      }
      return options;
    });

    return {
      abilityStore: reactive(abilityStore),
      ruleStore: reactive(ruleStore),
      form,
      hasFormErrors,
      hasValidationErrors,
      checkValidation,
      submit,
      rules
    };
  },
  components: {
    Alert,
    KwaiFieldset
  },
  i18n: messages
};
</script>
