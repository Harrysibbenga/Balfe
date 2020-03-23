<template>
  <div class="container-fluid">
    <div class="row">
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3 p-0"
        v-for="(content, index) in galleryContent"
        :key="index"
      >
        <img v-if="content.imageId" :src="content.url" class="img-fluid" />
        <b-embed
          type="iframe"
          aspect="16by9"
          :src="content.url"
          allowfullscreen
          v-else
        ></b-embed>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["galleryContent"])
  }
};
</script>
