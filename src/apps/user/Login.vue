<template>
  <!-- eslint-disable max-len -->
  <Dialog>
    <template slot="title">
      {{ $t('login.title') }}
    </template>
    <template>
      <FormulateForm
        name="login"
        v-model="form"
        @submit="login"
      >
        <FormulateInput
          type="email"
          name="email"
          :label="$t('login.form.email.label')"
          :required="true"
          :help="$t('login.form.email.help')"
          validation="^required|email"
          :validation-messages="{
            required: $t('login.form.required'),
            email: $t('login.form.email.invalid')
          }"
        />
        <FormulateInput
          type="password"
          name="password"
          :label="$t('login.form.password.label')"
          :required="true"
          validation="required"
          :validation-messages="{
            required: $t('login.form.required')
          }"
          :help="$t('login.form.password.help')"
        />
        <Alert
          v-if="invalidCredentials"
          type="danger"
        >
          {{ $t('login.form.invalidCredentials') }}
        </Alert>
        <Alert v-if="hasFormErrors">
          <FormulateErrors />
          {{ $t('login.form.contact') }}
        </Alert>
        <div class="flex justify-end mt-3">
          <FormulateInput
            :input-class="['bg-primary', 'hover:bg-primary_dark', 'text-primary_light']"
            type="submit"
          >
            <i class="fas fa-unlock mr-2"></i>
            {{ $t('login.form.submit') }}
          </FormulateInput>
        </div>
      </FormulateForm>
    </template>
  </Dialog>
</template>

<style scoped>
</style>

<script>
import lang from './lang';
import Alert from '@/components/Alert';
import Dialog from '@/components/Dialog';
import {getCurrentInstance, ref} from '@vue/composition-api';
import createAuthenticationService from '@/site/composables/useAuthentication';

export default {
  setup() {
    const authService = createAuthenticationService();

    const form = ref({
      email: '',
      password: ''
    });
    const hasFormErrors = ref(false);
    const invalidCredentials = ref(false);

    const vm = getCurrentInstance();

    const login = async() => {
      invalidCredentials.value = false;
      hasFormErrors.value = false;

      await authService.login.run({
        email: form.value.email,
        password: form.value.password
      });
      if (authService.login.error.value) {
        form.value.password = '';
        if (authService.login.error.value.response?.status === 401) {
          // Not Authorized
          invalidCredentials.value = true;
        } else {
          vm.$formulate.handle(authService.login.error.value, 'login');
        }
      } else {
        if (vm.$route.meta.back
          && vm.$route.meta.back.name !== vm.$route.name) {
          await vm.$router.push(vm.$route.meta.back);
        } else {
          await vm.$router.push({ name: 'home' });
        }
      }
    };

    return {
      form,
      hasFormErrors,
      invalidCredentials,
      login
    };
  },
  components: {
    Alert,
    Dialog
  },
  i18n: lang,
};
</script>
