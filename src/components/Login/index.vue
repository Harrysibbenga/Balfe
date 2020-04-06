<template>
  <div class="container">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <h1 class="text-left">Login</h1>
    <b-form @submit.prevent>
      <b-form-group
        id="email"
        label="Email address: "
        label-for="email"
        description="We'll never share your email with anyone else."
      >
        <b-input
          id="email"
          v-model.trim="formdata.email"
          type="email"
          required
          placeholder="Enter email"
          :class="{ invalid: $v.formdata.email.$error }"
          @blur="$v.formdata.email.$touch()"
        ></b-input>
        <div class v-if="$v.formdata.email.$error">
          <p class="error-lablel" v-if="!$v.formdata.email.required">This field is required</p>
          <p class="error-lablel" v-if="!$v.formdata.email.email">Please enter a valid email</p>
        </div>
      </b-form-group>
      <b-form-group id="password" label="Password: " label-for="password">
        <b-input
          v-model.trim="formdata.password"
          type="password"
          id="password"
          required
          placeholder="Enter Password"
          aria-describedby="password-help-block"
          @blur="$v.formdata.password.$touch()"
          :class="{ invalid: $v.formdata.password.$error }"
        ></b-input>
        <div v-if="$v.formdata.password.$error">
          <p class="error-lablel" v-if="!$v.formdata.password.required">This field is required</p>
          <p class="error-lablel" v-if="!$v.formdata.password.minLength">At Least 4 characters</p>
        </div>
      </b-form-group>
      <b-button @click="login" variant="primary">Login</b-button>
      <transition name="fade">
        <div v-if="errorMsg !== ''" class="error-msg">
          <p>{{ errorMsg }}</p>
        </div>
      </transition>
    </b-form>
  </div>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
const fb = require("../../firebaseConfig");
export default {
  data() {
    return {
      formdata: {
        email: "",
        password: ""
      },
      performingRequest: false,
      errorMsg: ""
    };
  },
  validations: {
    formdata: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(4)
      }
    }
  },
  methods: {
    login() {
      this.performingRequest = true;
      fb.auth
        .signInWithEmailAndPassword(this.formdata.email, this.formdata.password)
        .then(user => {
          this.$store.commit("setCurrentUser", user);
          this.performingRequest = false;
          this.$router.push("/dashboard");
        })
        .catch(err => {
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    }
  }
};
</script>

<style lang="css" scoped>
.form-control.invalid {
  border: red 1.5px solid !important;
}
</style>
