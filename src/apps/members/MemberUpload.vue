<template>
  <div>
    <PageHeader>
      <ApplicationHeader :content="$t('upload')" />
    </PageHeader>
    <div class="container mx-auto">
      <upload url="sport/judo/members/upload" field="csv" />
    </div>
  </div>
</template>

<script>
import messages from './lang';

import Upload from '@/components/Upload.vue';
import PageHeader from '@/components/PageHeader.vue';
import ApplicationHeader from '@/components/ApplicationHeader.vue';

/**
 * Page for uploading members file
 */
export default {
  i18n: messages,
  components: {
    ApplicationHeader,
    Upload,
    PageHeader
  }
};
</script>
