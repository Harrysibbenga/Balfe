<template>
  <div>
    <b-carousel
      id="carousel-intro"
      v-model="slide"
      :interval="3000"
      background="black"
      width="2560"
      height="1250"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
      fade
      no-hover-pause
    >
      <!-- Latest article -->
      <b-carousel-slide>
        <template v-slot:img>
          <img
            class="d-block img-fluid w-100"
            width="2560"
            height="1250"
            :src="latestNews.image"
            alt
          />
          <div class="mask"></div>
          <div class="container-fluid mb-5 text-container text-center text-white">
            <div class="row">
              <div class="partner-logo col-12 col-md-12 col-lg-6">
                <h1 class="h1">{{ latestNews.tilte }}</h1>
                <p class="excerpt">{{ latestNews.excerpt }}</p>
                <p class="date">{{ latestNews.date | formatDate}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <div class="row">
                  <div class="col-6 p-0">
                    <app-button
                      type="link"
                      :linkTo="`/post/${latestNews.id}`"
                      :addClass="['btn-md']"
                    >View</app-button>
                  </div>
                  <div class="col-6 p-0">
                    <app-button type="link" linkTo="news" :addClass="['btn-md']">View All</app-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </b-carousel-slide>

      <!-- History -->
      <b-carousel-slide>
        <template v-slot:img>
          <img class="d-block img-fluid w-100" width="2560" height="1250" :src="history.image" alt />
          <div class="mask"></div>
          <div class="container-fluid mb-5 text-container text-center text-white">
            <div class="row">
              <div class="partner-logo col-12 col-md-12 col-lg-6">
                <h1 class="h1">{{ history.tilte }}</h1>
                <p class="excerpt">{{ history.excerpt }}</p>
                <p class="date">{{ history.date | formatDate}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <div class="row">
                  <div class="col-6 p-0">
                    <app-button
                      type="link"
                      :linkTo="`/history/${history.id}`"
                      :addClass="['btn-md']"
                    >View</app-button>
                  </div>
                  <div class="col-6 p-0">
                    <app-button type="link" linkTo="news" :addClass="['btn-md']">View All</app-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
const fb = require("../../firebaseConfig");
import moment from "moment";
export default {
  data() {
    return {
      slide: 0,
      sliding: null,
      latestNews: null,
      history: null,
      hist: true
    };
  },
  methods: {
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
    },
    latestNewsPost() {
      fb.postsCollection
        .orderBy("date", "desc")
        .limit(1)
        .onSnapshot(querySnapshot => {
          let postsArray = [];
          querySnapshot.forEach(doc => {
            let post = doc.data();
            post.id = doc.id;
            postsArray.push(post);
          });
          this.latestNews = postsArray[0];
        });
    },
    historicPost() {
      this.$store.dispatch("history/setAllHistory");
      let allPosts = this.$store.getters["history/getAllHistory"];
      let rand = Math.floor(Math.random() * allPosts.length);
      for (let i = 0; i < allPosts.length; i++) {
        if (rand === i) {
          this.history = allPosts[i];
          this.hist = true;
        }
      }
    }
  },
  filters: {
    formatCreation(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).format("MMMM Do YYYY");
    }
  },
  created() {
    this.latestNewsPost();
    this.historicPost();
  }
};
</script>
