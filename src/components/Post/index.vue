<template>
  <div>
    <div class="container-fluid">
      <div class="row" v-if="post">
        <img :src="post.image" class="img-fluid" />
      </div>
      <hr class="balfe-line" />
      <h1>{{ post.title }}</h1>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          {{ post.main }}
        </div>
      </div>
      <div class="row">
        <div
          class="col-sm-6 col-md-4 col-lg-3"
          v-for="(image, index) in post.gallery"
          :key="index"
        >
          <img :src="image" />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          {{ post.comment }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState(["post"]),
    ...mapActions(["getPost"])
  },
  created() {
    let id = this.$route.params.id;
    console.log(id);
    this.$store.dispatch("getPost", id);
  },
  destroyed() {
    this.$store.commit("clearPost");
  }
};
</script>
