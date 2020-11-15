<template>
  <div v-if="season">
    <h1>Teams</h1>
    <table
      v-if="season.teams && season.teams.length > 0"
      class="table"
    >
      <tbody>
        <tr v-for="team in season.teams" :key="team.id">
          <td>{{ team.name }}</td>
        </tr>
      </tbody>
    </table>
    <Alert v-else>
      Er zijn nog geen teams gekoppeld aan dit seizoen!
    </Alert>
  </div>
</template>

<script>
import Alert from '@/components/Alert.vue';
import Season from '@/models/Season';

export default {
  props: {
    season: {
      type: [ Season, null ]
    }
  },
  components: {
    Alert
  }
};
</script>
