<template>
  <!-- eslint-disable max-len -->
  <div
    v-if="member"
    class="container mx-auto p-4"
  >
    <h1>Teams</h1>
    <p>
      Dit is een overzicht van de teams waarvan
      <strong>{{ member.person.name }}</strong>
      lid is.
    </p>
    <table class="w-full">
      <thead>
        <tr class="border-b">
          <th class="text-left p-3 px-5">Team</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="team in member.teams"
          :key="team.id"
        >
          <td class="p-3 px-5">
            {{ team.name }}
          </td>
          <td class="p-3 px-5">
            <router-link
              class="icon-button text-gray-700 hover:bg-gray-300"
              :to="{ name: 'teams.read', params: { id: team.id }}"
            >
              <i class="fas fa-ellipsis-h"></i>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {useMemberStore} from '@/apps/members/composables/useMembers';
import {computed, onMounted} from '@vue/composition-api';

export default {
  setup() {
    const members = useMemberStore();

    const member = computed(() => members.current);
    onMounted(() => members.loadTeams.run(member.value.id));

    return {
      member
    };
  },
  methods: {
    fetchData(params) {
      try {
        this.$store.dispatch('member/readTeams', {
          id: params.id
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
