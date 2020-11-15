<template>
  <!-- eslint-disable max-len -->
  <div class="container mx-auto mt-6">
    <div v-if="invitation">
      <Alert
        v-if="invitation.isExpired"
        type="danger"
      >
        {{ $t('invitation.expired') }}
      </Alert>
      <div v-else>
        <Alert type="info">
          {{ $t('invitation.intro') }}
        </Alert>
        <FormulateForm
          name="confirm"
          v-model="form"
          @submit="submit"
          @submit-raw="checkValidation"
          class="w-full"
        >
          <KwaiFieldset title="Gebruiker">
            <template slot="description">
              Geef uw naam in.
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
              Het emailadres waarmee je zal inloggen op onze website.
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
          <KwaiFieldset title="Paswoord">
            <template slot="description">
              Geef een paswoord in.
            </template>
            <FormulateInput
              name="password"
              type="password"
              :label="$t('form.password.label')"
              :placeholder="$t('form.password.placeholder')"
              :required="true"
              validation="^required|min:10,length|complex"
              :validation-rules="{
                complex: ({ value }) => passwordComplexity(value)
              }"
              :validation-messages="{
                required: $t('required'),
                min: 'Paswoord moet minstens 10 karakters bevatten',
                complex: 'Paswoord is niet complex genoeg'
              }"
            >
            </FormulateInput>
            <FormulateInput
              name="password_confirm"
              type="password"
              :label="$t('form.retype_password.label')"
              :placeholder="$t('form.retype_password.placeholder')"
              :required="true"
              validation="^required|confirm"
              :validation-messages="{
                required: $t('required'),
                confirm: 'De paswoorden zijn niet gelijk'
              }"
            >
            </FormulateInput>
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
  </div>
</template>

<script>
import Alert from '@/components/Alert.vue';
import KwaiFieldset from '@/components/forms/KwaiFieldset.vue';
import passwordComplexity from '@/js/passwordComplexity';
import messages from './lang';
import User from '@/models/users/User';
import {useInvitationStore} from '@/apps/users/composables/useInvitations';
// eslint-disable-next-line max-len
import {onMounted, reactive, ref, computed, getCurrentInstance} from '@vue/composition-api';

export default {
  props: {
    token: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useInvitationStore();
    const invitation = computed(() => store.current);
    onMounted(async() => {
      await store.readWithToken.run(props.token);
      form.value.email = store.current.email;
    });

    const form = ref({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      retype_password: ''
    });
    let hasFormErrors = ref(false);
    let hasValidationErrors = ref(false);
    async function checkValidation(submission) {
      hasValidationErrors.value = await submission.hasValidationErrors();
    }

    const vm = getCurrentInstance();
    async function submit() {
      const user = new User();
      user.first_name = form.value.first_name;
      user.last_name = form.value.last_name;
      user.email = form.value.email;
      user.password = form.value.password;
      await store.confirm.run(props.token, user);
      if (!store.confirm.error) {
        await vm.$router.push({
          name: 'home'
        });
      } else {
        hasFormErrors.value = true;
        this.$formulate.handle(store.save.error, 'confirm');
      }
    }

    return {
      store: reactive(store),
      invitation,
      form,
      hasFormErrors,
      hasValidationErrors,
      checkValidation,
      submit,
      passwordComplexity,
    };
  },
  i18n: messages,
  components: {
    Alert, KwaiFieldset
  }
};
</script>
