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
              <a
                class="icon-button text-red-300 hover:bg-red-900 mr-1"
                :href="facebook"
              >
                <i class="fab fa-facebook-f"></i>
              </a>
              <router-link
                v-if="isLoggedIn"
                class="icon-button text-red-300 hover-bg-red-900"
                :to="{ name: 'users.read', params: { id: activeUser.id } }">
                <i class="fas fa-user"></i>
              </router-link>
              <a
                v-if="isLoggedIn"
                class="icon-button text-red-300 hover-bg-red-900"
                @click="logout"
              >
                <i class="fas fa-sign-out-alt"></i>
              </a>
              <router-link
                v-else
                class="icon-button text-red-300 hover-bg-red-900"
                :to="{ name: 'user.login'}"
              >
                <i class="fas fa-lock"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
