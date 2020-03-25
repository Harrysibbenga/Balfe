<template>
  <div>
    <h1 class="text-left">Gallery</h1>
    <b-modal v-model="inputImage" hide-footer hide-header centered>
      <transition name="fade">
        <div v-if="performingRequest" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>
      <b-form @submit.prevent>
        <div class="input_field">
          <input
            type="file"
            @change="uploadImage"
            ref="fileInput"
            accept="image/*"
          />
        </div>
      </b-form>
      <div class="d-block text-right pt-3">
        <b-button
          class="mr-2"
          @click="confirmImageAdd"
          :disabled="newImage.name == ''"
          >Add</b-button
        >
      </div>
    </b-modal>

    <b-modal v-model="inputVideo" hide-footer hide-header centered>
      <transition name="fade">
        <div v-if="performingRequest" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>
      <b-form @submit.prevent>
        <div class="input_field">
          <input
            type="file"
            @change="uploadVideo"
            ref="fileInput"
            accept="image/*"
          />
        </div>
      </b-form>
      <div class="d-block text-right pt-3">
        <b-button
          class="mr-2"
          @click="confirmVideoAdd"
          :disabled="newVideo.name == ''"
          >Add</b-button
        >
      </div>
    </b-modal>

    <b-nav tabs>
      <b-nav-item @click="addNewImage">New image</b-nav-item>
      <b-nav-item @click="addNewVideo">New video</b-nav-item>
    </b-nav>

    <div v-if="selectImage.selected">
      <img :src="selectImage.selectedUrl" class="mt-3 img-fluid" />
    </div>
    <div v-if="selectVideo.selected">
      <b-embed
        type="iframe"
        aspect="16by9"
        :src="selectVideo.selectedUrl"
        allowfullscreen
      ></b-embed>
    </div>
    <div class="row">
      <div class="col-6">
        <b-form-select
          v-model="type"
          @change="typeChange"
          size="sm"
          class="mt-3"
        >
          <b-form-select-option :value="null" disabled
            >-- Please select type --</b-form-select-option
          >
          <b-form-select-option value="image">Image</b-form-select-option>
          <b-form-select-option value="video">Video</b-form-select-option>
        </b-form-select>
      </div>
      <div class="col-6">
        <div v-if="type == 'image'">
          <b-form-select
            v-model="selectImage.selected"
            :options="options"
            size="sm"
            class="mt-3"
            @change="selectI"
          >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled
                >-- Please select an image --</b-form-select-option
              >
            </template>
          </b-form-select>
          <div class="d-block text-right pt-3">
            <b-button
              variant="primary"
              :disabled="selectImage.selected == null"
              @click="addImage(image)"
              >Add image</b-button
            >
          </div>
        </div>
        <div v-if="type == 'video'">
          <b-form-select
            v-model="selectVideo.selected"
            :options="videoOptions"
            size="sm"
            class="mt-3"
            @change="selectV"
          >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled
                >-- Please select a video --</b-form-select-option
              >
            </template>
          </b-form-select>
          <div class="d-block text-right pt-3">
            <b-button
              variant="primary"
              :disabled="selectVideo.selected == null"
              @click="addVideo(video)"
              >Add video</b-button
            >
          </div>
        </div>
      </div>

      <div v-if="galleryContent.length > 0">
        <table class="table table-striped table-hover text-left">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Content</th>
              <th scope="col">Uploaded</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(content, index) in galleryContent" :key="index">
              <th scope="row">{{ content.name }}</th>
              <td>
                <img :src="content.url" class="img-fluid" />
              </td>
              <td>{{ content.createdOn | formatCreation }}</td>
              <td>
                <div
                  class="d-inline px-1 text-primary"
                  @click="removeContent(content)"
                >
                  Remove
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p class="text-left">
          Please select content to be displayed in the gallery or add some
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
const fb = require("../../../../firebaseConfig");
export default {
  data() {
    return {
      image: [],
      imageId: null,
      video: [],
      videoId: null,
      selectImage: {
        selected: null,
        selectedUrl: null
      },
      selectVideo: {
        selected: null,
        selectedUrl: null
      },
      type: null,
      inputImage: false,
      inputVideo: false,
      newImage: {
        name: "",
        url: ""
      },
      newVideo: {
        name: "",
        url: ""
      },
      performingRequest: false
    };
  },
  methods: {
    typeChange(type) {
      this.type = type;
    },
    selectV(id) {
      this.selectImage.selected = null;
      fb.videoCollection
        .doc(id)
        .get()
        .then(doc => {
          let video = doc.data();
          this.videoId = doc.id;
          this.selectVideo.selectedUrl = video.url;
          this.video = video;
        })
        .catch(err => {
          err;
        });
    },
    selectI(id) {
      this.selectVideo.selected = null;
      fb.imageUrlCollection
        .doc(id)
        .get()
        .then(doc => {
          let image = doc.data();
          this.imageId = doc.id;
          this.selectImage.selectedUrl = image.url;
          this.image = image;
        })
        .catch(err => {
          err;
        });
    },
    addVideo(video) {
      fb.galleryCollection
        .add({
          createdOn: new Date(),
          url: video.url,
          name: video.name,
          videoId: this.videoId
        })
        .then(() => {
          this.video = [];
          this.videoId = null;
          this.selectVideo.selected = null;
          this.selectVideo.selectedUrl = null;
        })
        .catch(err => {
          err;
        });
    },
    addImage(image) {
      fb.galleryCollection
        .add({
          createdOn: new Date(),
          url: image.url,
          name: image.name,
          imageId: this.imageId
        })
        .then(() => {
          this.image = [];
          this.imageId = null;
          this.selectImage.selected = null;
          this.selectImage.selectedUrl = null;
        })
        .catch(err => {
          err;
        });
    },
    removeContent(content) {
      fb.galleryCollection.doc(content.id).delete();
    },
    addNewImage() {
      this.inputImage = true;
    },
    confirmImageAdd() {
      fb.imageUrlCollection
        .where("name", "==", this.newImage.name)
        .get()
        .then(() => {
          this.imageId = true;
        })
        .then(() => {
          fb.galleryCollection
            .add({
              createdOn: new Date(),
              url: this.newImage.url,
              name: this.newImage.name,
              imageId: this.imageId
            })
            .then(() => {
              this.confirmImg = true;
              setTimeout(() => {
                this.confirmImg = false;
              }, 3000);
              this.inputImage = false;
              this.newImage.name = "";
              this.newImage.url = "";
              this.imageId = null;
            })
            .catch(err => {
              err;
            });
        });
    },
    addNewVideo() {
      this.inputVideo = true;
    },
    confirmVideoAdd() {
      fb.videosCollection
        .where("name", "==", this.newVideo.name)
        .get()
        .then(() => {
          this.videoId = true;
        })
        .then(() => {
          fb.galleryCollection
            .add({
              createdOn: new Date(),
              url: this.newVideo.url,
              name: this.newVideo.name,
              videoId: this.videoId
            })
            .then(() => {
              this.confirmVid = true;
              setTimeout(() => {
                this.confirmVid = false;
              }, 3000);
              this.inputVid = false;
              this.newVideo.name = "";
              this.newVideo.url = "";
              this.videoId = null;
            })
            .catch(err => {
              err;
            });
        });
    },
    uploadVideo(event) {
      let file = event.target.files[0];
      let storageRef = fb.storage.ref("videos/" + file.name);
      let uploadTask = storageRef.put(file);
      this.performingRequest = true;
      uploadTask.on(
        "state_changed",
        () => {
          // snapshot
        },
        () => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.newVideo.url = downloadURL;
            this.newVideo.name = file.name;
            fb.videosCollection
              .add({
                name: file.name,
                createdOn: new Date(),
                url: downloadURL
              })
              .then(() => {
                this.performingRequest = false;
              })
              .catch(err => {
                err;
              });
          });
        }
      );
    },
    uploadImage(event) {
      let file = event.target.files[0];
      let storageRef = fb.storage.ref("images/" + file.name);
      let uploadTask = storageRef.put(file);
      this.performingRequest = true;
      uploadTask.on(
        "state_changed",
        () => {
          // snapshot
        },
        () => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.newImage.name = file.name;
            this.newImage.url = downloadURL;
            fb.imageUrlCollection
              .add({
                name: file.name,
                createdOn: new Date(),
                url: downloadURL
              })
              .then(() => {
                this.performingRequest = false;
              })
              .catch(err => {
                err;
              });
          });
        }
      );
    }
  },
  computed: {
    ...mapState(["options", "videoOptions", "galleryContent"])
  },
  filters: {
    formatCreation(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    }
  }
};
</script>
