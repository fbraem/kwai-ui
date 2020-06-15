<template>
  <!-- eslint-disable max-len -->
  <div class="h-screen w-full max-w-sm mx-auto flex justify-center items-center">
    <div>
      <h1 class="font-hairline mb-6 text-center">
        {{ $t('login.title') }}
      </h1>
      <div class="border-red-700 p-8 border-t-8 bg-white mb-6 rounded-lg shadow-lg">
        <ValidationObserver v-slot="{ invalid }">
          <form @submit.prevent="login" class="flex flex-col">
            <Field
              rules="required|email"
              :label="$t('login.form.email.label')"
              id="login_email"
              :name="$t('login.form.email.label')"
              v-slot="{ valid, required }"
            >
              <InputField
                id="login_email"
                type="email"
                :required="required"
                :valid="valid"
                v-model="form.email"
              />
            </Field>
            <Field
              rules="required"
              :label="$t('login.form.password.label')"
              id="login_password"
              :name="$t('login.form.password.label')"
              v-slot="{ valid, required }"
            >
              <InputField
                id="login_password"
                type="password"
                :required="required"
                :valid="valid"
                v-model="form.password"
              />
            </Field>
            <Alert
              v-if="invalidCredentials"
              type="danger"
            >
              {{ $t('login.form.invalidCredentials') }}
            </Alert>
            <Alert
              v-if="error"
              type="danger"
            >
              {{ $t('login.form.error', { code: error.code, message: error.message })}}
              <br />
              <span class="text-sm">{{ $t('login.form.contact') }}</span>
            </Alert>
            <div class="flex justify-end mt-3">
              <button
                class="red-button disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="invalid"
              >
                <i class="fas fa-unlock"></i>&nbsp; {{ $t('login.form.submit') }}
              </button>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
import lang from './lang';
import InputField from '@/components/forms/InputField';
import Field from '@/components/forms/Field';
import Alert from '@/components/Alert';
import { extend, ValidationObserver } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

import { i18n } from '@/js/i18n';
i18n.setLocaleMessage('nl', lang.messages.nl);

extend('required', {
  ...required,
  message: i18n.t('login.form.required')
});
extend('email', {
  ...email,
  message: i18n.t('login.form.email.invalid')
});

export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      invalidCredentials: false,
      error: null
    };
  },
  components: {
    InputField,
    Field,
    Alert,
    ValidationObserver
  },
  i18n: lang,
  methods: {
    login() {
      this.invalidCredentials = false;
      this.error = null;
      this.$store.dispatch('authentication/login', {
        email: this.form.email,
        password: this.form.password
      })
        .then(() => {
          this.$router.push({ name: this.$route.meta.back ?? 'home' });
        }).catch((e) => {
          this.form.password = '';
          if (e.response?.status === 401) { // Not Authorized
            this.invalidCredentials = true;
          } else {
            if (e.response) {
              this.error = {
                code: e.response.status,
                message: e.response.statusText
              };
            } else {
              console.log(e);
            }
          }
        });
    }
  }
};
</script>
