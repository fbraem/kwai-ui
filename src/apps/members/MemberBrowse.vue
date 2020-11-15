<template>
  <div>
    <PageHeader>
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="flex-1 min-w-0">
          <ApplicationHeader :content="$t('members')" />
        </div>
        <div class="mt-5 flex sm:mt-0 sm:ml-4">
          <IconButton
            v-if="canUpload"
            class="bg-primary text-primary_light"
            icon="fas fa-file-import"
            :content="$t('upload')"
            :route="{ name: 'members.upload' }"
          />
        </div>
      </div>
    </PageHeader>
    <PageSection>
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
    </PageSection>
  </div>
</template>

<script>
import 'flag-icon-css/css/flag-icon.css';

import messages from './lang';
import jump from 'jump.js';

import Spinner from '@/components/Spinner.vue';
import Alert from '@/components/Alert.vue';
import MemberListItem from './MemberListItem.vue';
import {useMemberStore} from '@/apps/members/composables/useMembers';
// eslint-disable-next-line max-len
import {reactive, computed, onMounted, getCurrentInstance} from '@vue/composition-api';
import Member from '@/models/Member';
import PageHeader from '@/components/PageHeader.vue';
import PageSection from '@/components/PageSection.vue';
import ApplicationHeader from '@/components/ApplicationHeader.vue';
import IconButton from '@/components/IconButton.vue';

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

    const vm = getCurrentInstance();
    const canUpload = computed(() => {
      return vm.$can('upload', Member.type());
    });

    return {
      members: reactive(members),
      count,
      sortedMembers,
      canUpload
    };
  },
  components: {
    IconButton,
    ApplicationHeader,
    Spinner,
    MemberListItem,
    Alert,
    PageHeader,
    PageSection
  },
  i18n: messages,
  methods: {
    jumpIt(target) {
      jump(target);
    }
  }
};
</script>
