<template>
  <div>
    <h1 class="text-left">Settings</h1>
    <hr class="balfe-line" />
    <p>Update your profile</p>

    <transition name="fade">
      <p v-if="showSuccess" class="text-success">Profile updated</p>
    </transition>

    <b-form @submit.prevent>
      <b-form-group id="name" label="Name: " label-for="name">
        <b-input
          v-model.trim="userProfile.name"
          type="text"
          id="name"
          required
          placeholder="Enter name"
        ></b-input>
      </b-form-group>

      <b-form-group id="title" label="Title: " label-for="title">
        <b-input
          v-model.trim="userProfile.title"
          type="text"
          id="title"
          required
          placeholder="Enter title"
        ></b-input>
      </b-form-group>

      <b-button @click="updateProfile" varient="secondary">Update Profile</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      title: "",
      showSuccess: false
    };
  },
  computed: {
    userProfile() {
      return this.$store.getters["admin/getUserProfile"];
    }
  },
  methods: {
    updateProfile() {
      this.$store.dispatch("updateProfile", {
        name: this.name !== "" ? this.name : this.userProfile.name,
        title: this.title !== "" ? this.title : this.userProfile.title
      });

      this.name = "";
      this.title = "";

      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    }
  }
};
</script>