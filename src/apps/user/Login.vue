<template>
  <!-- eslint-disable max-len -->
  <div class="h-screen flex justify-center items-center">
    <div>
      <h1 class="font-hairline mb-6 text-center">Login to our Website</h1>
      <div class="border-red-700 p-8 border-t-8 bg-white mb-6 rounded-lg shadow-lg">
        <ValidationObserver v-slot="{ invalid }">
          <form @submit.prevent="login" class="flex flex-col">
            <Field
              rules="required|email"
              label="Email"
              id="login_email"
              name="Email"
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
              label="Password"
              id="login_password"
              name="Password"
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
              v-if="error"
              type="danger"
            >
              Can't login. Please check your credentials.
            </Alert>
            <div class="flex justify-end mt-3">
              <button
                class="red-button disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="invalid"
              >
                <i class="fas fa-unlock"></i>&nbsp; Login
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
import messages from './lang';
import InputField from '@/components/forms/InputField';
import Field from '@/components/forms/Field';
import Alert from '@/components/Alert';
import { extend, ValidationObserver } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: '{_field_} is required'
});
extend('email', {
  ...email,
  message: 'Enter a valid email'
});

export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      error: false
    };
  },
  components: {
    InputField,
    Field,
    Alert,
    ValidationObserver
  },
  i18n: messages,
  methods: {
    login() {
      this.error = false;
      this.$store.dispatch('authentication/login', {
        email: this.form.email,
        password: this.form.password
      })
        .then(() => {
          this.$router.push({ name: this.$route.meta.back ?? 'home' });
        }).catch((e) => {
          this.form.fields.password.value = '';
          if (e.response?.status === 401) { // Not Authorized
            this.error = true;
          } else {
            console.log(e);
          }
        });
    }
  }
};
</script>
