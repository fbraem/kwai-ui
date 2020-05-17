<template>
  <div class="w-full" :class="fgColor">
    <div class="p-5 h-full rounded-lg" :class="bgColor">
      <h2>{{ title }}</h2>
      <div class="flex flex-col">
        <div class="message-card-content">
          <slot>
          </slot>
        </div>
        <div class="self-center mt-2 p-2 bg-white">
          <img
            :src="image"
            style="height:125px"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    bgColor: {
      type: String
    },
    fgColor: {
      type: String
    }
  }
};
</script>
