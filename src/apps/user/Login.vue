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
        ref="form"
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

export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      hasFormErrors: false,
      invalidCredentials: false
    };
  },
  components: {
    Alert,
    Dialog
  },
  i18n: lang,
  methods: {
    async login() {
      this.invalidCredentials = false;
      this.hasFormErrors = false;

      try {
        await this.$store.dispatch('authentication/login', {
          email: this.form.email,
          password: this.form.password
        });
        if (this.$route.meta.back) {
          await this.$router.push({
            name: this.$route.meta.back.name,
            params: this.$route.meta.back.params
          });
        } else {
          await this.$router.push({ name: 'home' });
        }
      } catch (error) {
        this.form.password = '';
        if (error.response?.status === 401) { // Not Authorized
          this.invalidCredentials = true;
        } else {
          this.$formulate.handle(error, 'login');
        }
      }
    }
  }
};
</script>
