<template>
  <div>
    <h2 class="pl-3 pb-5 font-weight-bold">Media</h2>
    <div class="container-fluid border-top border-bottom border-primary">
      <div class="row">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3 p-0"
          v-for="(content, index) in galleryContent"
          :key="index"
        >
          <div v-if="content.imageId">
            <img :src="content.url" class="img-fluid" />
          </div>
          <div v-if="content.videoId">
            <b-embed type="iframe" aspect="16by9" :src="content.url" allowfullscreen></b-embed>
          </div>
        </div>
      </div>
    </div>

    <nav aria-label="Media results">
      <ul class="pagination justify-content-center pt-5">
        <li class="page-item disabled">
          <span class="page-link">Previous</span>
        </li>
        <li class="page-item">
          <a class="page-link active" href="#">1</a>
        </li>
        <li class="page-item" aria-current="page">
          <a href="#" class="page-link">2</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">3</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  computed: {
    galleryContent() {
      return this.$store.getters["gallery/getGallery"];
    }
  },
  created() {
    this.$store.dispatch("gallery/setGallery");
  }
};
</script>
