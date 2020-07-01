<template>
  <div>
    <div class="bg-red-700 border-b-8 border-gray-800">
      <div class="container mx-auto">
        <div class="flex flex-col">
          <div class="flex justify-between items-center sm:p-4 w-full">
            <div class="text-xl ml-2">
              <a class="no-underline text-red-300 hover:no-underline fond-bold"
                href="/"
              >
                {{ title }}
              </a>
            </div>
            <div class="flex mr-1">
              <IconLink
                icon="fab fa-facebook-f"
                class="text-primary_light hover:bg-primary_dark"
                :link="facebook"
              />
              <IconLink
                v-if="isLoggedIn && activeUser"
                icon="fas fa-user"
                class="text-primary_light hover:bg-primary_dark"
                :route="{ name: 'users.read', params: { id: activeUser.id } }"
              />
              <IconLink
                v-if="isLoggedIn"
                icon="fas fa-sign-out-alt"
                class="text-primary_light hover:bg-primary_dark"
                :method="logout"
              />
              <IconLink
                v-else
                icon="fas fa-lock"
                class="text-primary_light hover:bg-primary_dark"
                :route="{ name: 'user.login'}"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconLink from '@/components/IconLink';
export default {
  components: {
    IconLink
  },
  computed: {
    title() {
      return this.$store.state.kwai.page.title;
    },
    subTitle() {
      return this.$store.state.kwai.page.subTitle;
    },
    facebook() {
      return this.$store.state.kwai.facebook;
    },
    isLoggedIn() {
      return this.$store.getters['authentication/isLoggedIn'];
    },
    activeUser() {
      return this.$store.state.authentication.user;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('authentication/logout')
        .then(() => {
          this.$router.push('/', () => {});
        })
      ;
    }
  }
};
</script>
