<template>
  <div class="container mx-auto p-4">
    <Spinner
       v-if="members.load.isRunning"
       class="text-center"
    >
    </Spinner>
    <div v-else>
      <Alert
        v-if="count === 0"
        type="warning"
      >
        {{ $t('no_members') }}
      </Alert>
      <div
        class="flex flex-wrap items-center justify-center"
        v-else
      >
        <div
          v-for="(group, letter) in sortedMembers"
          class="mr-2"
          :key="letter"
        >
          <span class="badge bg-red-700 cursor-pointer">
            <a
              class="no-underline hover:no-underline text-red-300"
              @click="jumpIt('#letter-' + letter)">
              {{letter}}
            </a>
          </span>
        </div>
      </div>
      <div style="column-count: 3; column-gap: 30px;margin-top: 30px;">
        <div
          v-for="(group, letter) in sortedMembers"
          :key="letter"
        >
          <h3 class="border-l-4 border-solid pl-2"
            :id="'letter-' + letter"
          >
            {{ letter }}
          </h3>
          <ul>
            <MemberListItem
              v-for="member in group"
              :member="member"
              :key="member.id"
            />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'flag-icon-css/css/flag-icon.css';

import messages from './lang';
import jump from 'jump.js';

import Spinner from '@/components/Spinner';
import Alert from '@/components/Alert';
import MemberListItem from './MemberListItem';
import {useMemberStore} from '@/apps/members/composables/useMembers';
import {reactive, computed, onMounted} from '@vue/composition-api';

/**
 * Page for browsing a member
 */
export default {
  setup() {
    const members = useMemberStore();
    const count = computed(() => members.all.length);

    const sortedMembers = computed(() => {
      const result = {};
      members.all.forEach((e) => {
        const firstChar = e.person.lastname.charAt(0).toUpperCase();
        if (!result[firstChar]) result[firstChar] = [];
        result[firstChar].push(e);
      });
      return result;
    });

    onMounted(() => members.load.run());

    return {
      members: reactive(members),
      count,
      sortedMembers
    };
  },
  components: {
    Spinner,
    MemberListItem,
    Alert
  },
  i18n: messages,
  methods: {
    jumpIt(target) {
      jump(target);
    }
  }
};
</script>
