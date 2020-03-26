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
            <th scope="col">Image</th>
            <th scope="col">Date</th>
            <th scope="col">Updated</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in posts" :key="index">
            <th scope="row">{{ post.title }}</th>
            <td>{{ post.excerpt }}</td>
            <td>
              <img :src="post.image" class="img-fluid" />
            </td>
            <td>{{ post.date | formatDate }}</td>
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
    <b-modal v-model="deleteDialog" hide-footer hide-header centered>
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

    <b-modal v-model="editDialog" hide-footer hide-header centered>
      <transition name="fade">
        <div v-if="performingRequest" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>
      <b-form @submit.prevent>
        <div v-if="selectImage.selected">
          <img :src="selectImage.selectedUrl" class="mt-3 img-fluid" />
        </div>
        <div v-else>
          <img :src="currentPost.image" v-if="!newImage" class="img-fluid" />
          <img :src="post.image" v-if="newImage" class="img-fluid" />
        </div>
        <div class="input_field">
          <input type="file" @change="uploadImage" ref="fileInput" accept="image/*" />
        </div>
        <b-form-select
          v-model="selectImage.selected"
          :options="options"
          size="sm"
          class="mt-3"
          @change="selectOption"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
          </template>
        </b-form-select>
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

        <b-form-group id="content" label="Content" label-for="content" class="text-left">
          <wysiwyg id="content" v-model="post.content">
            {{
            currentPost.content
            }}
          </wysiwyg>
        </b-form-group>

        <b-form-group id="date" label="Date" label-for="date" class="text-left">
          <datepicker id="date" v-model="post.date" :value="currentPost.date"></datepicker>
        </b-form-group>
      </b-form>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="editOnConfirm">Edit</b-button>
        <b-button variant="primary" @click="editOnCancel">Cancel</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
const fb = require("../../../firebaseConfig");

export default {
  data() {
    return {
      post: {
        image: "",
        title: "",
        content: "",
        excerpt: "",
        date: ""
      },
      performingRequest: false,
      newImage: false,
      deleteDialog: false,
      editDialog: false,
      currentPost: {},
      toDelete: null,
      toEdit: null,
      selectImage: {
        selected: null,
        selectedUrl: null
      }
    };
  },
  computed: {
    ...mapState(["posts", "options"])
  },
  methods: {
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
    editPost(post) {
      this.toEdit = post;
      this.currentPost = post;
      this.editDialog = true;
      this.post.image = this.currentPost.image;
      this.post.title = this.currentPost.title;
      this.post.content = this.currentPost.content;
      this.post.excerpt = this.currentPost.excerpt;
      this.post.date = this.currentPost.date;
    },
    editOnCancel() {
      this.editDialog = false;
      this.currentPost = {};
    },
    editOnConfirm() {
      this.editDialog = false;

      let image = this.post.image,
        title = this.post.title,
        content = this.post.content,
        excerpt = this.post.excerpt,
        date = this.post.date;

      fb.postsCollection
        .doc(this.toEdit.id)
        .update({
          createdOn: new Date(),
          image: image,
          title: title,
          content: content,
          excerpt: excerpt,
          date: date
        })
        .then(() => {
          this.currentPost = {};
          this.newImage = false;
        })
        .catch(error => alert(error.message));
    },
    uploadImage(event) {
      let file = event.target.files[0];
      let storageRef = fb.storage.ref("images/" + file.name);
      let uploadTask = storageRef.put(file);
      this.newImage = true;
      this.selectImage.selected = false;
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
            this.post.image = downloadURL;

            fb.imageUrlCollection
              .add({
                name: file.name,
                createdOn: new Date(),
                url: downloadURL
              })
              .then(() => {
                this.performingRequest = false;
              })
              .catch(error => alert(error.message));
          });
        }
      );
    },
    selectOption(id) {
      if (id) {
        fb.imageUrlCollection
          .doc(id)
          .get()
          .then(doc => {
            let image = doc.data();
            this.selectImage.selectedUrl = image.url;
            this.post.image = image.url;
          })
          .catch(error => alert(error.message));
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
  }
};
</script>

<style lang="scss" scoped>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
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
