<template>
  <div>
    <h1 class="text-left">Manage posts</h1>
    <hr class="balfe-line" />
    <div v-if="posts.length > 0">
      <table class="table table-striped table-hover text-left">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Excerpt</th>
            <th scope="col">Date</th>
            <th scope="col">Updated</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in posts" :key="index">
            <th scope="row">{{ post.title }}</th>
            <td>{{ post.excerpt }}</td>
            <td>{{ post.date | formatDate}}</td>
            <td>{{ post.createdOn | formatCreation }}</td>
            <td>
              <div class="d-inline px-1 text-dark" @click="editPost(post)">Edit</div>
              <div class="d-inline px-1 text-primary" @click="deletePost(post)">Delete</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Sorry no posts yet .......... Add some!</div>
    <!-- Modals  -->

    <!-- New image modal  -->
    <b-modal
      v-model="newImageUpload"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <h5>Upload a new image</h5>

      <transition name="fade">
        <div v-if="request" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>

      <div class="container">
        <div v-if="imageUrl">
          <img :src="imageUrl" class="img-fluid" />
        </div>
      </div>

      <input
        type="file"
        @change="checkFile"
        ref="fileInput"
        accept="image/*"
        v-if="input == 'post'"
      />

      <input
        type="file"
        @change="checkFile"
        ref="galleryInput"
        accept="image/*"
        v-if="input == 'gallery'"
      />

      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="close">Close</b-button>
      </div>

      <p class="text-success" v-if="confirmation">Image uploaded !</p>
    </b-modal>
    <!-- New image modal  -->

    <!-- Delete post  -->
    <b-modal
      v-model="deleteDialog"
      hide-footer
      hide-header
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <div class="d-block text-center">
        <p>
          Are you sure you want to delete this post ? ( there's no turning back
          )
        </p>
      </div>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="deleteOnConfirm">Yes, delete</b-button>
        <b-button variant="primary" @click="deleteOnCancel">No, do not delete it</b-button>
      </div>
    </b-modal>
    <!-- Delete post  -->

    <!-- Edit post  -->
    <b-modal
      v-model="editDialog"
      hide-footer
      hide-header
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <transition name="fade">
        <div v-if="request" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>

      <b-form @submit.prevent>
        <div>
          <img :src="currentPost.image" v-if="!newImage" class="img-fluid" />
          <img :src="post.image" v-if="newImage" class="img-fluid" />
        </div>

        <b-button class="btn btn-outline-primary" @click="addNewImage($event)" value="post">+ Image</b-button>

        <b-button
          class="btn btn-outline-primary ml-2"
          @click="chooseImage($event)"
          value="post"
        >+ Select Image</b-button>

        <b-form-group id="title" label="Title" label-for="title" class="text-left">
          <b-input
            id="title"
            v-model.trim="post.title"
            type="text"
            :placeholder="currentPost.title"
          ></b-input>
        </b-form-group>

        <b-form-group id="excerpt" label="Excerpt" label-for="excerpt" class="text-left">
          <b-input
            id="excerpt"
            v-model.trim="post.excerpt"
            type="text"
            :placeholder="currentPost.excerpt"
          ></b-input>
        </b-form-group>

        <b-form-group id="main" label="Main" label-for="main" class="text-left">
          <wysiwyg id="main" v-model="post.main" :value="currentPost.main"></wysiwyg>
        </b-form-group>

        <b-form-group id="comments" label="Comments" label-for="comments" class="text-left">
          <wysiwyg id="comments" v-model="post.comments" :value="currentPost.comments"></wysiwyg>
        </b-form-group>

        <b-form-group id="date" label="Date" label-for="date" class="text-left">
          <datepicker id="date" v-model="post.date"></datepicker>
          <span>Current date: {{ currentPost.date | formatDate}}</span>
        </b-form-group>

        <!-- gallery images  -->
        <h4>Gallery images</h4>

        <div class="form-group">
          <b-button
            class="btn btn-outline-primary"
            @click="addNewImage($event)"
            value="gallery"
          >+ Image</b-button>

          <b-button
            class="btn btn-outline-primary ml-2"
            @click="chooseImage($event)"
            value="gallery"
          >+ Select Images</b-button>
        </div>

        <p class="text-success" v-if="confirmation">Image uploaded !</p>
        <!-- gallery view  -->
        <div class="row">
          <div
            class="col-sm-6 col-md-4 col-lg-4 gallery-cont p-0"
            v-for="(image, index) in currentPost.gallery"
            :key="index"
            :ref="`div_${index}`"
            @mouseover="hoverDiv(index)"
            @mouseout="hoverDiv(-1)"
            @click="removeImage(image.id, currentPost.id)"
          >
            <img
              :src="image.url"
              class="img-fluid gallery-image"
              :class="{'selected': isSelected(index)}"
            />
            <div :class="{'selected' : isSelected(index), 'mask' :isSelected(index)}"></div>
            <div :class="{'selected' : isSelected(index)}" class="delete-text">Delete</div>
          </div>
        </div>
        <!-- gallery view  -->
      </b-form>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="editOnConfirm">Edit</b-button>
        <b-button variant="primary" @click="editOnCancel">Cancel</b-button>
      </div>
    </b-modal>
    <!-- Edit post  -->

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
      <h5>Duplicate image</h5>

      <div class="container">
        <img :src="imageUrl" class="img-fluid" />
      </div>

      <p>Duplicate image would you like to use this image ?</p>

      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="confirm">Yes</b-button>
        <b-button class="mr-2" @click="decline">No</b-button>
      </div>
    </b-modal>
    <!-- User Prompt  -->
    <!-- Select single image -->
    <b-modal
      v-model="postChoice"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <b-form-group label="Images">
        <b-form-radio-group id="radio" v-model="select" name="Images">
          <div class="container-fluid">
            <div class="row">
              <div class="col-4" v-for="(image, index) in images" :key="index">
                <img class="img-fluid" :src="image.url" />
                <b-form-radio :value="image.id" class="mx-auto"></b-form-radio>
              </div>
            </div>
          </div>
        </b-form-radio-group>
      </b-form-group>
      <b-button class="mr-2 text-left" @click="confirmSelection">Confirm</b-button>
      <b-button class="mr-2 text-left" @click="closeSel">Close</b-button>
    </b-modal>
    <!-- Select single image  -->

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

    <!-- Modals  -->
  </div>
</template>

<script>
import moment from "moment";
const fb = require("../../../firebaseConfig");

export default {
  data() {
    return {
      post: {
        image: "",
        title: "",
        main: "",
        comments: "",
        excerpt: "",
        date: "",
        gallery: ""
      },
      currentPost: {},
      toDelete: null,
      toEdit: null,
      input: null,
      selected: [],
      select: "",
      selectedDiv: -1,
      currentGallery: [],
      imageChoice: null,
      postChoice: null,
      defaultDate: null,
      // modals
      userPrompt: false,
      newImageUpload: false,
      newImage: null,
      deleteDialog: false,
      editDialog: false
    };
  },
  computed: {
    posts() {
      return this.$store.getters["posts/getPosts"];
    },
    request() {
      return this.$store.getters["images/getRequest"];
    },
    imageUrl() {
      return this.$store.getters["images/getImageUrl"];
    },
    confirmation() {
      return this.$store.getters["images/confirmation"];
    },
    images() {
      return this.$store.getters["images/getImages"];
    }
  },
  methods: {
    hoverDiv(selectedIndex) {
      this.selectedDiv = selectedIndex;
    },
    isSelected(divIndex) {
      return this.selectedDiv === divIndex;
    },
    // delete post
    deletePost(post) {
      this.toDelete = post;
      this.deleteDialog = true;
    },
    deleteOnCancel() {
      this.deleteDialog = false;
    },
    deleteOnConfirm() {
      this.deleteDialog = false;
      fb.postsCollection
        .doc(this.toDelete.id)
        .delete()
        .catch(error => alert(error.message));
    },
    // edit post
    editPost(post) {
      this.toEdit = post;
      this.currentPost = post;
      this.defaultDate = post.date;
      this.editDialog = true;
      this.post.image = this.currentPost.image;
      this.post.title = this.currentPost.title;
      this.post.main = this.currentPost.main;
      this.post.comments = this.currentPost.comments;
      this.post.excerpt = this.currentPost.excerpt;
      this.post.gallery = this.currentPost.gallery;
      this.post.imageId = this.currentPost.imageId;
    },
    editOnCancel() {
      this.editDialog = false;
      this.checkGallery();
    },
    editOnConfirm() {
      if (this.post.date == "") {
        this.post.date = this.defaultDate;
      }

      this.editDialog = false;

      let image = this.post.image,
        title = this.post.title,
        main = this.post.main,
        comments = this.post.comments,
        excerpt = this.post.excerpt,
        date = this.post.date,
        gallery = this.post.gallery,
        imageId = this.post.imageId;

      fb.postsCollection
        .doc(this.toEdit.id)
        .update({
          createdOn: new Date(),
          image: image,
          imageId: imageId,
          title: title,
          comments: comments,
          main: main,
          excerpt: excerpt,
          date: date,
          gallery: gallery
        })
        .then(() => {
          this.currentPost = {};
          this.post.image = "";
          this.post.title = "";
          this.post.main = "";
          this.post.comments = "";
          this.post.excerpt = "";
          this.post.gallery = "";
          this.post.imageId = "";
          this.post.date = "";
          this.newImage = false;
          this.selected = [];
        })
        .catch(error => alert(error.message));
    },
    // adding a new image
    addNewImage(event) {
      if (event.target.value == "post") {
        this.newImageUpload = true;
        this.input = "post";
      } else if (event.target.value == "gallery") {
        this.newImageUpload = true;
        this.input = "gallery";
      }
    },
    //check the file to see if it exists
    checkFile(event) {
      let file = event.target.files[0];
      let exist = false;
      fb.imageUrlCollection
        .where("name", "==", file.name)
        .get()
        .then(docs => {
          docs.forEach(doc => {
            if (doc.exists) {
              exist = true;
              if (this.input == "post") {
                this.post.image = doc.data().url;
                this.newImage = true;
                this.imageId = doc.id;
                this.userPrompt = true;
                this.$store.commit("images/setImageUrl", doc.data().url);
              } else if (this.input == "gallery") {
                this.imageId = doc.id;
                this.userPrompt = true;
                this.$store.commit("images/setImageUrl", doc.data().url);
              }
              return;
            }
          });
        })
        .then(() => {
          if (!exist) {
            this.$store.dispatch("images/uploadImage", file);
          }
        });
    },
    // prompt user that image exists
    decline() {
      if (this.input == "post") {
        this.userPrompt = false;
        this.$store.commit("images/setImageUrl", null);
        this.imageId = null;
        this.$refs.fileInput.value = "";
        this.post.image = null;
        this.input == "";
        this.newImage = false;
      } else if (this.input == "gallery") {
        this.userPrompt = false;
        this.imageId = null;
        this.$refs.galleryInput.value = "";
        this.input == "";
        this.post.image = null;
        this.$store.commit("images/setImageUrl", null);
      }
    },
    confirm() {
      if (this.input == "gallery") {
        fb.imageUrlCollection
          .doc(this.imageId)
          .get()
          .then(doc => {
            let image = doc.data();
            let galleryImage = {
              name: image.name,
              url: image.url,
              id: doc.id
            };
            this.currentPost.gallery.push(galleryImage);
          })
          .then(() => {
            this.userPrompt = false;
            this.$refs.galleryInput.value = "";
            this.input = "";
            this.newImageUpload = false;
            this.$store.commit("images/setImageUrl", null);
          });
      } else if (this.input == "post") {
        this.post.image = this.$store.getters["images/getImageUrl"];
        this.userPrompt = false;
        this.$refs.fileInput.value = "";
        this.newImageUpload = false;
        this.$store.commit("images/setImageUrl", null);
        this.newImage = true;
        this.input = "";
      }
    },
    close() {
      if (this.input == "post") {
        this.newImageUpload = false;
        this.$refs.fileInput.value = "";
        this.post.image = this.$store.getters["images/getImageUrl"];
        this.$store.commit("images/setImageUrl", null);
        this.input = "";
      } else if (this.input == "gallery") {
        let url = this.$store.getters["images/getImageUrl"];
        fb.imageUrlCollection
          .where("url", "==", url)
          .get()
          .then(docs => {
            docs.forEach(doc => {
              let image = doc.data();
              let galleryImage = {
                name: image.name,
                url: image.url,
                id: doc.id
              };
              this.currentPost.gallery.push(galleryImage);
            });
          })
          .then(() => {
            this.newImageUpload = false;
            this.$refs.galleryInput.value = "";
            this.$store.commit("images/setImageUrl", null);
            this.input = "";
          });
      }
    },
    // select image
    chooseImage(event) {
      if (event.target.value == "post") {
        this.postChoice = true;
        this.select = this.currentPost.imageId;
      } else if (event.target.value == "gallery") {
        this.imageChoice = true;
        if (this.currentPost.gallery.length > 0) {
          for (let i = 0; i < this.currentPost.gallery.length; i++) {
            let selId = this.currentPost.gallery[i].id;
            this.selected.push(selId);
          }
        }
      }
    },
    confirmSelection() {
      if (this.postChoice) {
        fb.imageUrlCollection
          .doc(this.select)
          .get()
          .then(doc => {
            let image = doc.data();
            this.newImage = true;
            this.post.image = image.url;
            this.post.imageId = doc.id;
          })
          .then(() => {
            this.postChoice = false;
          });
      } else if (this.imageChoice) {
        let nullish = this.selected.filter(e => e != null);
        let uniqueArray = this.getUnique(nullish);
        if (uniqueArray.length > 0) {
          let gallery = [];
          this.currentPost.gallery = [];
          for (let i = 0; i < uniqueArray.length; i++) {
            fb.imageUrlCollection
              .doc(uniqueArray[i])
              .get()
              .then(doc => {
                let image = doc.data();
                let galleryImage = {
                  name: image.name,
                  url: image.url,
                  id: doc.id
                };
                gallery.push(galleryImage);
              });
          }
          this.currentPost.gallery = gallery;
          this.post.gallery = gallery;
          this.imageChoice = false;
        } else {
          this.currentPost.gallery = [];
        }
      }
    },
    closeSel() {
      if (this.postChoice) {
        this.postChoice = false;
      } else if (this.imageChoice) {
        this.imageChoice = false;
        this.selected = [];
      }
    },
    removeImage(imageId, postId) {
      for (var i = 0; i < this.currentPost.gallery.length; i++) {
        if (this.currentPost.gallery[i].id === imageId) {
          this.currentPost.gallery.splice(i, 1);
        }
      }
      fb.postsCollection
        .doc(postId)
        .get()
        .then(doc => {
          let post = doc.data();
          this.currentGallery = post.gallery;
        });
    },
    checkGallery() {
      if (this.currentGallery !== this.currentPost.gallery) {
        this.currentPost.gallery = this.currentGallery;
      }
    },
    getUnique(array) {
      let uniqueArray = [];

      // Loop through array values
      for (var value of array) {
        if (uniqueArray.indexOf(value) === -1) {
          uniqueArray.push(value);
        }
      }
      return uniqueArray;
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
    this.$store.dispatch("posts/getPosts");
    this.$store.dispatch("images/getImages");
  }
};
</script>

<style lang="scss" scoped>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
.delete-text.selected {
  color: white;
  display: block;
}
.gallery-cont {
  position: relative;
}
.delete-text {
  display: none;
  position: absolute;
  font-size: 1.5rem;
  font-weight: 500;
  top: 50%;
  left: 38%;
  transition: 0.5s all ease-in;
}
.mask.selected {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.mask {
  transition: 0.5s all ease-in;
}

.loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(black, 0.4);
  z-index: 9999;

  p {
    background: white;
    width: 150px;
    text-align: center;
    margin: 40vh auto 0;
    padding: 40px 0;
    border-radius: 3px;
    box-shadow: 0 0 20px 0 rgba(black, 0.5);
  }
}
// transitions
.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-leave-active {
  transition: opacity 0s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
