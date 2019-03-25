<template>
  <!-- eslint-disable max-len -->
  <div uk-grid>
    <div
      v-if="picture"
      class="uk-width-1-1 uk-width-1-2@m uk-width-2-3@l uk-width-3-5@xl uk-flex uk-flex-middle"
    >
      <div>
        <img :src="picture" />
      </div>
    </div>
    <div
      v-if="page"
      class="uk-width-1-1"
      :class="{ 'uk-width-1-2@m' : picture != null, 'uk-width-1-3@l' : picture != null, 'uk-width-2-5@xl' : picture != null }"
    >
      <div uk-grid>
        <div class="uk-width-expand">
          <div class="uk-card uk-card-body">
            <div
              class="uk-card-badge uk-label"
              style="font-size: 0.75rem;background-color:#c61c18;color:white"
            >
              <router-link
                :to="categoryLink"
                class="uk-link-reset"
              >
                {{ page.category.name }}
              </router-link>
            </div>
            <div class="uk-light">
              <h1>
                {{ page.content.title }}
              </h1>
            </div>
            <p v-html="page.content.html_summary">
            </p>
          </div>
        </div>
        <div class="uk-width-1-1 uk-width-1-6@m">
          <div class="uk-flex uk-flex-right">
            <div
              v-if="$can('update', page)"
              class="uk-margin-small-left"
            >
              <router-link
                :to="{ name : 'pages.update', params : { id : page.id }}"
                class="uk-icon-button uk-link-reset"
              >
                <i class="fas fa-edit"></i>
              </router-link>
            </div>
            <div
              v-if="$can('delete', page)"
              class="uk-margin-small-left"
            >
              <a
                uk-toggle="target: #delete-page"
                class="uk-icon-button uk-link-reset"
              >
                <i class="fas fa-trash"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import messages from './lang';

/**
 * Component for a page header
 */
export default {
  i18n: messages,
  computed: {
    page() {
      return this.$store.getters['page/page'](this.$route.params.id);
    },
    picture() {
      if (this.page) return this.page.picture;
      return null;
    },
    categoryLink() {
      return {
        name: 'pages.category',
        params: {
          category: this.page.category.id
        }
      };
    },
  }
};
</script>