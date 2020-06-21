<template>
  <!-- eslint-disable max-len -->
  <Dialog>
    <template slot="title">
      {{ $t('login.title') }}
    </template>
    <template>
      <ValidationObserver v-slot="{ invalid }">
        <form @submit.prevent="login" class="flex flex-col">
          <KwaiField
            rules="required|email"
            :label="$t('login.form.email.label')"
            id="login_email"
            :name="$t('login.form.email.label')"
            v-slot="{ valid, required }"
          >
            <KwaiInputField
              id="login_email"
              type="email"
              :required="required"
              :valid="valid"
              v-model="form.email"
            />
          </KwaiField>
          <KwaiField
            rules="required"
            :label="$t('login.form.password.label')"
            id="login_password"
            :name="$t('login.form.password.label')"
            v-slot="{ valid, required }"
          >
            <KwaiInputField
              id="login_password"
              type="password"
              :required="required"
              :valid="valid"
              v-model="form.password"
            />
          </KwaiField>
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
            <KwaiButton
              icon="fas fa-unlock"
              :disabled="invalid"
              type="submit"
            >
              {{ $t('login.form.submit') }}
            </KwaiButton>
          </div>
        </form>
      </ValidationObserver>
    </template>
  </Dialog>
</template>

<style scoped>
</style>

<script>
import lang from './lang';
import KwaiInputField from '@/components/forms/KwaiInputField';
import KwaiField from '@/components/forms/KwaiField';
import Alert from '@/components/Alert';
import KwaiButton from '@/components/forms/KwaiButton';
import Dialog from '@/components/Dialog';
import { extend, ValidationObserver } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

import { i18n } from '@/js/i18n';
i18n.setLocaleMessage(i18n.locale, lang.messages[i18n.locale]);

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
    KwaiInputField,
    KwaiField,
    Alert,
    Dialog,
    ValidationObserver,
    KwaiButton
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
