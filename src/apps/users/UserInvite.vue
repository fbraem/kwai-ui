<template>
  <div class="container mx-auto mt-6">
    <div>
      <Alert type="warning">
        {{ $t('invite_intro') }}
      </Alert>
      <FormulateForm
        name="invite"
        v-model="form"
        @submit="submit"
        @submit-raw="checkValidation"
        class="w-full"
      >
        <KwaiFieldset title="Gebruiker">
          <template slot="description">
            Geef de naam van de gebruiker.
          </template>
          <div class="w-full">
            <FormulateInput
              name="first_name"
              :label="$t('form.first_name.label')"
              :placeholder="$t('form.first_name.placeholder')"
              :required="true"
              validation="required"
              :validation-messages="{
                required: $t('required')
              }"
            >
            </FormulateInput>
          </div>
          <div class="w-full">
            <FormulateInput
              name="last_name"
              :label="$t('form.last_name.label')"
              :placeholder="$t('form.last_name.placeholder')"
              :required="true"
              validation="required"
              :validation-messages="{
                required: $t('required')
              }"
            >
            </FormulateInput>
          </div>
        </KwaiFieldset>
        <KwaiFieldset title="Email">
          <template slot="description">
            Het emailadres waar de uitnodiging naar gestuurd wordt.
          </template>
          <div class="w-full">
            <FormulateInput
              name="email"
              :label="$t('form.email.label')"
              :placeholder="$t('form.email.placeholder')"
              :required="true"
              validation="^required|email"
              :validation-messages="{
                required: $t('required'),
                email: 'Dit is geen geldig emailadres'
              }"
            >
            </FormulateInput>
          </div>
        </KwaiFieldset>
        <Alert
          v-if="hasFormErrors"
          type="danger"
        >
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
              v-if="store.save.isRunning"
              class="fas fa-spinner fa-spin mr-2"
            ></i>
            <i v-else class="fas fa-save mr-2"></i>
            Bewaar
          </FormulateInput>
        </div>
      </FormulateForm>
    </div>
  </div>
</template>

<script>
import messages from './lang';

import KwaiFieldset from '@/components/forms/KwaiFieldset.vue';
import Alert from '@/components/Alert.vue';
import {useInvitationStore} from '@/apps/users/composables/useInvitations';
import {getCurrentInstance, reactive, ref} from '@vue/composition-api';
import Invitation from '@/models/users/Invitation';

export default {
  setup() {
    const store = useInvitationStore();

    const form = ref({
      first_name: '',
      last_name: '',
      email: ''
    });
    let hasFormErrors = ref(false);
    let hasValidationErrors = ref(false);
    async function checkValidation(submission) {
      hasValidationErrors.value = await submission.hasValidationErrors();
    }

    const vm = getCurrentInstance();
    async function submit() {
      hasFormErrors.value = false;
      let invitation = new Invitation();
      invitation.name = form.value.first_name + ' ' + form.value.last_name;
      invitation.email = form.value.email;
      await store.save.run(invitation);
      if (!store.save.error) {
        await vm.$router.push({
          name: 'users.browse'
        });
      } else {
        hasFormErrors.value = true;
        this.$formulate.handle(store.save.error, 'invite');
      }
    }

    return {
      store: reactive(store),
      form,
      hasFormErrors,
      hasValidationErrors,
      checkValidation,
      submit
    };
  },
  i18n: messages,
  components: {
    KwaiFieldset,
    Alert
  },
};
</script>
