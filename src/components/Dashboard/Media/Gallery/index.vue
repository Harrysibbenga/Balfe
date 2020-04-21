<template>
  <div>
    <h1 class="text-left">Gallery</h1>

    <b-nav tabs>
      <b-button class="btn btn-primary mx-1" @click="addNew($event)" value="image">New image</b-button>

      <b-button
        class="btn btn-primary mx-1"
        @click="chooseContent($event)"
        value="image"
      >Select image</b-button>

      <b-button class="btn btn-primary mx-1" @click="addNew($event)" value="video">New video</b-button>

      <b-button
        class="btn btn-primary mx-1"
        @click="chooseContent($event)"
        value="video"
        v
      >Select video</b-button>
    </b-nav>

    <!-- gallery images  -->
    <div v-if="galleryContent.length > 0" class="container-fluid">
      <h5 class="mt-3">Gallery Content</h5>
      <div class="row">
        <div
          class="col-6 col-md-4 col-lg-2"
          v-for="(content, index) in galleryContent"
          :key="index"
        >
          <img :src="content.url" class="img-fluid" v-if="content.imageId" />
          <b-embed
            type="iframe"
            aspect="16by9"
            :src="content.url"
            allowfullscreen
            v-if="content.videoId"
          ></b-embed>

          <p scope="row">{{ content.name }}</p>
          <div class="d-block">
            <p class="d-inline">Uploaded: {{ content.createdOn | formatCreation }}</p>
            <div class="d-inline px-1 text-primary" @click="removeContent(content)">Remove</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-left">Please select content to be displayed in the gallery or add some</p>
    </div>
    <!-- gallery images  -->

    <!-- Modals  -->
    <!-- New content modal  -->
    <b-modal
      v-model="newUpload"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <h5 v-if="input == 'image'">Upload a new image</h5>
      <h5 v-if="input == 'video'">Upload a new video</h5>

      <transition name="fade">
        <div v-if="imageRequest" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="videoRequest" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>

      <div class="container">
        <div v-if="imageUrl">
          <img :src="imageUrl" class="img-fluid" />
        </div>

        <div v-if="videoUrl">
          <b-embed type="iframe" aspect="16by9" :src="videoUrl" allowfullscreen></b-embed>
        </div>
      </div>

      <input
        type="file"
        @change="checkFile"
        ref="imageInput"
        accept="image/*"
        v-if="input == 'image'"
      />

      <input
        type="file"
        @change="checkFile"
        ref="videoInput"
        accept="video/*"
        v-if="input == 'video'"
      />

      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="close">Close</b-button>
      </div>

      <p class="text-success" v-if="videoConfirm">Video uploaded sucsessfully!</p>
      <p class="text-success" v-if="imageConfirm">Image uploaded sucsessfully!</p>
    </b-modal>
    <!-- New content modal  -->
    <!-- User Prompt  -->
    <b-modal
      v-model="userPrompt"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <h5 v-if="input == 'image'">Duplicate image</h5>
      <h5 v-if="input == 'video'">Duplicate video</h5>

      <div class="container" v-if="input == 'image'">
        <img :src="imageUrl" class="img-fluid" />
      </div>

      <div class="container" v-if="input == 'video'">
        <b-embed type="iframe" aspect="16by9" :src="videoUrl" allowfullscreen></b-embed>
      </div>

      <p>Duplicate content would you like to use this ?</p>

      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="confirm">Yes</b-button>
        <b-button class="mr-2" @click="decline">No</b-button>
      </div>
    </b-modal>
    <!-- User Prompt  -->
    <!-- Select images -->
    <b-modal
      v-model="imageChoice"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <b-form-group label="Images">
        <b-form-checkbox-group id="checkbox" v-model="selected" name="Images">
          <div class="container-fluid">
            <div class="row">
              <div class="col-4" v-for="(image, index) in images" :key="index">
                <img class="img-fluid" :src="image.url" />
                <b-form-checkbox :value="image.id" class="mx-auto"></b-form-checkbox>
              </div>
            </div>
          </div>
        </b-form-checkbox-group>
      </b-form-group>
      <b-button class="mr-2 text-left" @click="confirmSelection">Confirm</b-button>
      <b-button class="mr-2 text-left" @click="closeSel">Close</b-button>
    </b-modal>
    <!-- Select images  -->

    <!-- Select videos -->
    <b-modal
      v-model="videoChoice"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <b-form-group label="Videos">
        <b-form-checkbox-group id="checkbox" v-model="selected" name="Videos">
          <div class="container-fluid">
            <div class="row">
              <div class="col-4" v-for="(video, index) in videos" :key="index">
                <b-embed type="iframe" aspect="16by9" :src="video.url" allowfullscreen></b-embed>
                <b-form-checkbox :value="video.id" class="mx-auto"></b-form-checkbox>
              </div>
            </div>
          </div>
        </b-form-checkbox-group>
      </b-form-group>
      <b-button class="mr-2 text-left" @click="confirmSelection">Confirm</b-button>
      <b-button class="mr-2 text-left" @click="closeSel">Close</b-button>
    </b-modal>
    <!-- Select videos  -->
    <!-- Modals  -->
  </div>
</template>

<script>
import moment from "moment";
const fb = require("../../../../firebaseConfig");

export default {
  data() {
    return {
      image: [],
      imageId: null,
      video: [],
      videoId: null,
      newUpload: null,
      userPrompt: null,
      input: null,
      selected: [],
      videoChoice: false,
      imageChoice: false
    };
  },
  methods: {
    addVideo(video, id) {
      fb.galleryCollection
        .add({
          createdOn: new Date(),
          url: video.url,
          name: video.name,
          videoId: id
        })
        .catch(err => {
          err;
        });
    },
    addImage(image, id) {
      fb.galleryCollection
        .add({
          createdOn: new Date(),
          url: image.url,
          name: image.name,
          imageId: id
        })
        .catch(err => {
          err;
        });
    },
    removeContent(content) {
      fb.galleryCollection.doc(content.id).delete();
    },
    // adding a new
    addNew(event) {
      if (event.target.value == "image") {
        this.newUpload = true;
        this.input = "image";
      } else if (event.target.value == "video") {
        this.newUpload = true;
        this.input = "video";
      }
    },
    //check the file to see if it exists
    checkFile(event) {
      let file = event.target.files[0];
      let exist = false;
      if (this.input == "image") {
        fb.imageUrlCollection
          .where("name", "==", file.name)
          .get()
          .then(docs => {
            docs.forEach(doc => {
              if (doc.exists) {
                exist = true;
                this.image = doc.data().url;
                this.imageId = doc.id;
                this.userPrompt = true;
                this.$store.commit("images/setImageUrl", doc.data().url);
                return;
              }
            });
          })
          .then(() => {
            if (!exist) {
              this.$store.dispatch("images/uploadImage", file);
            }
          });
      } else if (this.input == "video") {
        fb.videosCollection
          .where("name", "==", file.name)
          .get()
          .then(docs => {
            docs.forEach(doc => {
              if (doc.exists) {
                exist = true;
                this.video = doc.data().url;
                this.videoId = doc.id;
                this.userPrompt = true;
                this.$store.commit("videos/setVideoUrl", doc.data().url);
                return;
              }
            });
          })
          .then(() => {
            if (!exist) {
              this.$store.dispatch("videos/uploadVideo", file);
            }
          });
      }
    },
    // prompt user that image exists
    decline() {
      if (this.input == "image") {
        this.userPrompt = false;
        this.$store.commit("images/setImageUrl", null);
        this.imageId = null;
        this.$refs.imageInput.value = "";
        this.image = null;
        this.input == "";
      } else if (this.input == "video") {
        this.userPrompt = false;
        this.videoId = null;
        this.$refs.videoInput.value = "";
        this.input == "";
        this.video = null;
        this.$store.commit("videos/setVideoUrl", null);
      }
    },
    confirm() {
      if (this.input == "image") {
        this.addImage(this.image, this.imageId);
        this.userPrompt = false;
        this.$refs.imageInput.value = "";
        this.newUpload = false;
        this.$store.commit("images/setImageUrl", null);
        this.input = "";
      } else if (this.input == "video") {
        this.addVideo(this.video, this.videoId);
        this.userPrompt = false;
        this.$refs.videoInput.value = "";
        this.newUpload = false;
        this.$store.commit("videos/setVideoUrl", null);
        this.input = "";
      }
    },
    close() {
      if (this.input == "image") {
        this.newUpload = false;
        this.$refs.imageInput.value = "";
        let url = this.$store.getters["images/getImageUrl"];
        fb.imageUrlCollection
          .where("url", "==", url)
          .get()
          .then(docs => {
            docs.forEach(doc => {
              let image = doc.data();
              let imageId = doc.id;
              this.addImage(image, imageId);
            });
          })
          .then(() => {
            this.$store.commit("images/setImageUrl", null);
            this.input = "";
          });
      } else if (this.input == "video") {
        this.newUpload = false;
        this.$refs.imageInput.value = "";
        let url = this.$store.getters["videos/getVideoUrl"];
        fb.videosCollection
          .where("url", "==", url)
          .get()
          .then(docs => {
            docs.forEach(doc => {
              let video = doc.data();
              let videoId = doc.id;
              this.addVideo(video, videoId);
            });
          })
          .then(() => {
            this.$store.commit("videos/getVideoUrl", null);
            this.input = "";
          });
      }
    },
    // select image
    chooseContent(event) {
      if (event.target.value == "image") {
        this.imageChoice = true;
      } else if (event.target.value == "video") {
        this.videoChoice = true;
      }
    },
    confirmSelection() {
      if (this.imageChoice) {
        for (let i = 0; i < this.selected.length; i++) {
          fb.imageUrlCollection
            .doc(this.selected[i])
            .get()
            .then(doc => {
              let image = doc.data();
              image.id = doc.id;
              this.addImage(image, image.id);
            })
            .then(() => {
              this.imageChoice = false;
            });
        }
      } else if (this.videoChoice) {
        for (let i = 0; i < this.selected.length; i++) {
          fb.videosCollection
            .doc(this.selected[i])
            .get()
            .then(doc => {
              let video = doc.data();
              video.id = doc.id;
              this.addVideo(video, video.id);
            })
            .then(() => {
              this.videoChoice = false;
            });
        }
      }
    },
    closeSel() {
      if (this.imageChoice) {
        this.selected = [];
        this.imageChoice = false;
      } else if (this.videoChoice) {
        this.videoChoice = false;
        this.selected = [];
      }
    }
  },
  computed: {
    galleryContent() {
      return this.$store.getters["gallery/getGallery"];
    },
    imageUrl() {
      return this.$store.getters["images/getImageUrl"];
    },
    videoUrl() {
      return this.$store.getters["video/getVideoUrl"];
    },
    imageRequest() {
      return this.$store.getters["images/getRequest"];
    },
    videoRequest() {
      return this.$store.getters["videos/getRequest"];
    },
    imageConfirm() {
      return this.$store.getters["images/confirmation"];
    },
    videoConfirm() {
      return this.$store.getters["videos/confirmation"];
    },
    images() {
      return this.$store.getters["images/getImages"];
    },
    videos() {
      return this.$store.getters["videos/getAllVideos"];
    }
  },
  filters: {
    formatCreation(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    }
  },
  created() {
    this.$store.dispatch("gallery/setGallery");
    this.$store.dispatch("images/setImages");
    this.$store.dispatch("videos/setAllVideos");
  }
};
</script>
