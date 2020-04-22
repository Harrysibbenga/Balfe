<template>
  <div>
    <h2 class="pl-3 pb-5 font-weight-bold">Media</h2>
    <div class="container-fluid border-top border-bottom border-primary">
      <div class="row">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3 p-0"
          v-for="(content, index) in paginatedData"
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
        <li class="page-item">
          <b-button class="page-link" :disabled="pageNumber == 0" @click="prevPage">Previous</b-button>
        </li>
        <li class="page-item">
          <b-button class="page-link" :disabled="pageNumber >= pageCount -1" @click="nextPage">Next</b-button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageNumber: 0
    };
  },
  props: {
    size: {
      type: Number,
      required: false,
      default: 12
    }
  },
  computed: {
    galleryContent() {
      return this.$store.getters["gallery/getGallery"];
    },
    pageCount() {
      let l = this.galleryContent.length,
        s = this.size;
      return Math.ceil(l / s);
    },
    paginatedData() {
      const start = this.pageNumber * this.size,
        end = start + this.size;
      return this.galleryContent.slice(start, end);
    }
  },
  methods: {
    nextPage() {
      this.pageNumber++;
    },
    prevPage() {
      this.pageNumber--;
    }
  },
  created() {
    this.$store.dispatch("gallery/setGallery");
  }
};
</script>
