<template>
  <div class="container text-left">
    <h1 class="text-left">Add posts</h1>
    <hr class="balfe-line" />
    <b-form @submit.prevent="submitHandler">
      <img :src="post.image" class="img-fluid" />
      <div class="input_field">
        <input
          type="file"
          @change="uploadImage"
          ref="fileInput"
          accept="image/*"
        />
      </div>

      <b-form-group
        id="title"
        label="Title"
        label-for="title"
        class="text-left"
      >
        <b-input
          id="title"
          v-model.trim="post.title"
          type="text"
          required
          placeholder="Maximun 100 characters"
          :class="{ invalid: $v.post.title.$error }"
          v-model="post.title"
          @blur="$v.post.title.$touch()"
        ></b-input>
        <p class="error-label" v-if="$v.post.title.$error">
          This input is required
        </p>
        <p class="error-label" v-if="!$v.post.title.maxLength">
          Maximum of {{ $v.post.title.$params.maxLength.max }} characters
        </p>
      </b-form-group>

      <b-form-group
        id="excerpt"
        label="Excerpt"
        label-for="excerpt"
        class="text-left"
      >
        <b-input
          id="excerpt"
          v-model.trim="post.excerpt"
          type="text"
          required
          placeholder="Maximun 500 characters"
          :class="{ invalid: $v.post.excerpt.$error }"
          v-model="post.excerpt"
          @blur="$v.post.excerpt.$touch()"
        ></b-input>
        <p class="error-label" v-if="$v.post.excerpt.$error">
          This input is required
        </p>
        <p class="error-label" v-if="!$v.post.excerpt.maxLength">
          Maximum of {{ $v.post.excerpt.$params.maxLength.max }} characters
        </p>
      </b-form-group>

      <b-form-group
        id="content"
        label="Content"
        label-for="content"
        class="text-left"
      >
        <wysiwyg id="content" v-model="post.content"></wysiwyg>
      </b-form-group>

      <b-form-group id="date" label="Date" label-for="date" class="text-left">
        <datepicker
          id="date"
          v-model="post.date"
          @blur="$v.post.date.$touch()"
          required
        ></datepicker>
        <p class="error-label" v-if="$v.post.date.$error">Date required</p>
      </b-form-group>

      <b-button type="submit" :disabled="post.title == ''" variant="primary"
        >Add post</b-button
      >
    </b-form>

    <b-modal v-model="dialog" hide-footer hide-header centered>
      <div class="d-block text-center">
        <p>Your post has no content are you sure you want to post this ?</p>
      </div>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="dialogOnCancel">Close</b-button>
        <b-button variant="primary" @click="dialogOnConfirm">Add post</b-button>
      </div>
    </b-modal>

    <div v-if="postAdded" variant="success">Your post has been added!</div>
  </div>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";
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
      fullPost: {},
      dialog: false,
      postAdded: null
    };
  },
  validations: {
    post: {
      title: {
        required,
        maxLength: maxLength(100)
      },
      excerpt: {
        required,
        maxLength: maxLength(500)
      },
      date: {
        required
      }
    }
  },
  methods: {
    createPost() {
      fb.postsCollection
        .add({
          createdOn: new Date(),
          image: this.post.image,
          content: this.post.content,
          title: this.post.title,
          excerpt: this.post.excerpt,
          date: this.post.date
        })
        .then(() => {
          this.postAdded = true;
        })
        .then(() => {
          this.$v.$reset(),
            (this.$refs.fileInput.value = ""),
            (this.post.content = ""),
            (this.post.image = ""),
            (this.post.title = ""),
            (this.post.excerpt = ""),
            (this.post.date = "");
          setInterval(() => {
            this.postAdded = null;
          }, 3000);
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitHandler() {
      if (!this.$v.$invalid) {
        if (this.post.content === "") {
          this.dialog = true;
        } else {
          this.createPost();
        }
      } else {
        alert("Something is wrong");
      }
    },
    dialogOnCancel() {
      this.dialog = false;
    },
    dialogOnConfirm() {
      this.dialog = false;
      this.createPost();
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
            this.post.image = downloadURL;
            console.log("File available at", downloadURL);
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
                console.log(err);
              });
          });
        }
      );
    }
  }
};
</script>

<style lang="css" scoped>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
.form-control.invalid {
  border: red 1.5px solid !important;
}
</style>
