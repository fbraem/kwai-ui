<template>
  <!-- eslint-disable max-len -->
  <div>
    <PageHeader>
      <div
        v-if="member"
        class="container mx-auto flex flex-col p-4 lg:p-6 "
      >
        <div class="text-xl font-bold flex flex-wrap justify-between">
          <div>
            <h1>Ledeninformatie</h1>
            <h2>
              {{ member.person.name }}
              <sup
                :class="flagClass"
                class="flag-icon text-sm"
              >
              </sup>
            </h2>
          </div>
          <div>
            <i
              class="fas fa-bars fa-2x hover:cursor-pointer"
              @click.stop.prevent="showMenu = !showMenu"
            >
            </i>
          </div>
        </div>
        <div v-if="showMenu">
          <MegaMenu
            class="mega-menu"
            role="toggle"
          >
            <MegaMenuBlock
              class="w-full sm:w-1/2 lg:w-1/4 border-gray-600 border-b sm:border-r lg:border-b-0"
              :to="{ name: 'members.read', params: { id: member.id }}"
              linkTitle='Toon het profiel ...'
            >
              <div class="flex justify-center align-center mb-2">
                <img
                  class="h-32 w-32 rounded-full"
                  :src="image"
                >
              </div>
            </MegaMenuBlock>
            <MegaMenuBlock
              class="w-full sm:w-1/2 lg:w-1/4 border-gray-600 border-b sm:border-r-0 lg:border-r lg:border-b-0"
              title="Teams"
              logo="fas fa-users"
              :to="{ name: 'members.teams', params: { id: member.id }}"
            >
              <p class="text-gray-100 text-sm">
                Bekijk tot welke teams <strong>{{ member.person.name }}</strong> behoort.
              </p>
            </MegaMenuBlock>
            <MegaMenuBlock
              class="w-full sm:w-1/2 lg:w-1/4 border-gray-600 border-b sm:border-b-0 sm:border-r md:border-b-0"
              title="Trainingen"
              logo="fas fa-university"
              :to="{ name: 'members.trainings', params: { id: member.id }}"
            >
              <p class="text-gray-100 text-sm">
                Aan welke trainingen heeft <strong>{{ member.person.name }}</strong> deel genomen?
              </p>
            </MegaMenuBlock>
            <MegaMenuBlock
              class="w-full sm:w-1/2 lg:w-1/4"
              title="Tornooien"
              logo="fas fa-trophy"
              :to="{ name: 'members.tournaments', params: { id: member.id }}"
            >
              <p class="text-gray-100 text-sm">
                Voor welke tornooien is <strong>{{ member.person.name }}</strong> ingeschreven?
                Wat waren de resultaten?
              </p>
            </MegaMenuBlock>
          </MegaMenu>
        </div>
      </div>
    </PageHeader>
    <div
      v-if="member"
      class="container mx-auto p-4"
    >
      <div class="bg-gray-300 p-10">
        <MemberProfileCard :member="member" />
      </div>
      <router-view name="member_information">
      </router-view>
    </div>
  </div>
</template>

<script>
import MemberProfileCard from './components/MemberProfileCard';
import {useMemberStore} from '@/apps/members/composables/useMembers';
import {onMounted, reactive, computed, ref} from '@vue/composition-api';

import PageHeader from '@/components/PageHeader';
import MegaMenu from '@/components/MegaMenu';
import MegaMenuBlock from '@/components/MegaMenuBlock';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const members = useMemberStore();
    onMounted(() => members.read.run(props.id));
    const member = computed(() => members.current);

    const flagClass = computed(
      () => {
        if (member) {
          return 'flag-icon-'
            + member.value.person.nationality.iso_2.toLowerCase();
        }
        return '';
      }
    );

    const image = computed(
      () => member?.image ?? require('./images/no_avatar.png')
    );

    const showMenu = ref(false);

    return {
      members: reactive(members),
      member,
      flagClass,
      image,
      showMenu
    };
  },
  components: {
    MegaMenuBlock,
    MegaMenu,
    PageHeader,
    MemberProfileCard
  }
};
</script>
