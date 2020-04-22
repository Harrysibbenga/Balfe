<template>
  <div>
    <div class="container-fluid">
      <div class="row" v-if="post">
        <img :src="post.image" class="img-fluid" />
      </div>
      <h1>{{ post.title }}</h1>
      <hr class="balfe-line" />
    </div>
    <div class="container">
      <div class="row py-5">
        <div class="col-12 p-0" v-html="post.main"></div>
      </div>
      <div class="row">
        <div
          class="col-sm-6 col-md-4 col-lg-3 p-0"
          v-for="(image, index) in post.gallery"
          :key="index"
        >
          <img :src="image.url" class="img-fluid" />
        </div>
      </div>
      <div class="row py-5">
        <div class="col-12 p-0" v-html="post.comments"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    post() {
      return this.$store.getters["posts/getPost"];
    }
  },
  created() {
    let id = this.$route.params.id;
    this.$store.dispatch("posts/setPost", id);
  },
  destroyed() {
    this.$store.commit("posts/clearPost");
  }
};
</script>
