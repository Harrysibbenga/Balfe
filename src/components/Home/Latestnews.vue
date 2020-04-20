<template >
  <div>
    <h2 class="pl-3 pb-5 font-weight-bold">Latest News</h2>
    <div class="container-lg">
      <div class="row">
        <div class="col-md-4" v-for="(post, index) in latestPosts" :key="index">
          <img class="img-fluid" :src="post.image" />
          <div class="text-container">
            <h4 class="h5 py-2 text-center">{{ post.title }}</h4>
            <p class="excerpt">{{ post.excerpt | trimLength }}</p>
            <p class="date">{{ post.date | formatDate }}</p>
            <div class="container-fluid p-0 mb-5">
              <div class="row">
                <div class="col-md-6">
                  <app-button type="link" :linkTo="`/post/${post.id}`" :addClass="['btn-md']">View</app-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
const fb = require("../../firebaseConfig");

export default {
  data() {
    return {
      latestPosts: []
    };
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).format("MMMM Do YYYY");
    },
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    }
  },
  created() {
    fb.postsCollection
      .orderBy("date", "desc")
      .limit(3)
      .onSnapshot(querySnapshot => {
        let postsArray = [];

        querySnapshot.forEach(doc => {
          let post = doc.data();
          post.id = doc.id;
          postsArray.push(post);
        });
        this.latestPosts = postsArray;
      });
  }
};
</script>
