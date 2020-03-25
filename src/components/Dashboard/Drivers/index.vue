<template>
  <div class="container text-left">
    <h1 class="text-left">Drivers</h1>
    <hr class="balfe-line" />
    <b-form @submit.prevent="submitHandler">
      <img :src="driver.image" class="img-fluid" />
      <div class="input_field">
        <input
          type="file"
          @change="uploadImage"
          ref="fileInput"
          accept="image/*"
        />
      </div>

      <b-form-group
        id="firstName"
        label="First name"
        label-for="firstName"
        class="text-left"
      >
        <b-input
          id="firstName"
          v-model.trim="driver.firstName"
          type="text"
          v-model="driver.firstName"
        ></b-input>
      </b-form-group>

      <b-form-group
        id="secondName"
        label="Second name"
        label-for="secondName"
        class="text-left"
      >
        <b-input
          id="secondName"
          v-model.trim="driver.secondName"
          type="text"
          v-model="driver.secondName"
        ></b-input>
      </b-form-group>

      <b-button
        type="submit"
        :disabled="driver.firstName == '' || driver.secondName == ''"
        variant="primary"
        >Add driver</b-button
      >
    </b-form>

    <div v-if="driverAdded" variant="success">Driver has been added!</div>

    <hr class="balfe-line" />
    <div v-if="drivers.length > 0">
      <table class="table table-striped table-hover text-left">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Image</th>
            <th scope="col">Career</th>
            <th scope="col">Updated</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(driver, index) in drivers" :key="index">
            <th scope="row">{{ driver.fullName }}</th>
            <td>
              <img :src="driver.image" class="img-fluid" />
            </td>
            <td>{{ driver.career }}</td>
            <td>{{ driver.createdOn | formatCreation }}</td>
            <td>
              <div class="d-inline px-1 text-dark" @click="editdriver(driver)">
                Edit
              </div>
              <div
                class="d-inline px-1 text-primary"
                @click="deletedriver(driver)"
              >
                Delete
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Sorry no drivers yet .......... Add some!</div>
    <b-modal v-model="deleteDialog" hide-footer hide-header centered>
      <div class="d-block text-center">
        <p>
          Are you sure you want to delete this driver ? ( there's no turning
          back )
        </p>
      </div>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="deleteOnConfirm">Yes, delete</b-button>
        <b-button variant="primary" @click="deleteOnCancel"
          >No, do not delete it</b-button
        >
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
          <img :src="currentDriver.image" v-if="!newImage" class="img-fluid" />
          <img :src="driver.image" v-if="newImage" class="img-fluid" />
        </div>
        <div class="input_field">
          <input
            type="file"
            @change="uploadImage"
            ref="fileInput"
            accept="image/*"
          />
        </div>
        <b-form-select
          v-model="selectImage.selected"
          :options="options"
          size="sm"
          class="mt-3"
          @change="selectOption"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled
              >-- Please select an option --</b-form-select-option
            >
          </template>
        </b-form-select>
        <b-form-group
          id="firstName"
          label="First Name"
          label-for="firstName"
          class="text-left"
        >
          <b-input
            id="firstName"
            v-model.trim="driver.firstName"
            type="text"
            :placeholder="currentDriver.firstName"
          ></b-input>
        </b-form-group>

        <b-form-group
          id="secondName"
          label="Second Name"
          label-for="secondName"
          class="text-left"
        >
          <b-input
            id="secondName"
            v-model.trim="driver.secondName"
            type="text"
            :placeholder="currentDriver.secondName"
          ></b-input>
        </b-form-group>

        <b-form-group
          id="career"
          label="Career"
          label-for="career"
          class="text-left"
        >
          <wysiwyg id="careerription" v-model="driver.career">{{
            currentDriver.career
          }}</wysiwyg>
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
      driver: {
        image: "",
        firstName: "",
        secondName: "",
        career: ""
      },
      performingRequest: false,
      dialog: false,
      driverAdded: null,
      newImage: false,
      deleteDialog: false,
      editDialog: false,
      currentDriver: {},
      toDelete: null,
      toEdit: null,
      selectImage: {
        selected: null,
        selectedUrl: null
      }
    };
  },
  computed: {
    ...mapState(["drivers", "options"])
  },
  validations: {},
  methods: {
    createDriver() {
      fb.driversCollection
        .add({
          createdOn: new Date(),
          image: this.driver.image,
          fullName: this.driver.firstName + " " + this.driver.secondName,
          firstName: this.driver.firstName,
          secondName: this.driver.secondName
        })
        .then(() => {
          this.driverAdded = true;
        })
        .then(() => {
          (this.$refs.fileInput.value = ""),
            (this.driver.fullName = ""),
            (this.driver.image = ""),
            (this.driver.firstName = ""),
            (this.driver.secondName = ""),
            setInterval(() => {
              this.driverAdded = null;
            }, 3000);
        })
        .catch(err => {});
    },
    submitHandler() {
      if (this.driver.firstName === "" || this.driver.secondName === "") {
        this.dialog = true;
      } else {
        this.createDriver();
      }
    },
    diaimagenCancel() {
      this.dialog = false;
    },
    diaimagenConfirm() {
      this.dialog = false;
      this.createDriver();
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
            this.driver.image = downloadURL;
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
              .catch(err => {});
          });
        }
      );
    },
    deletedriver(driver) {
      this.toDelete = driver;
      this.deleteDialog = true;
    },
    deleteOnCancel() {
      this.deleteDialog = false;
    },
    deleteOnConfirm() {
      this.deleteDialog = false;
      fb.driversCollection.doc(this.toDelete.id).delete();
    },
    editdriver(driver) {
      this.toEdit = driver;
      this.currentDriver = driver;
      this.editDialog = true;
      this.driver.image = this.currentDriver.image;
      this.driver.firstName = this.currentDriver.firstName;
      this.driver.secondName = this.currentDriver.secondName;
      this.driver.career = this.currentDriver.career;
    },
    editOnCancel() {
      this.editDialog = false;
      this.currentDriver = {};
      this.driver.image = "";
      this.driver.fullName = "";
      this.driver.image = "";
      this.driver.firstName = "";
      this.driver.secondName = "";
    },
    editOnConfirm() {
      this.editDialog = false;

      let image = this.driver.image,
        secondName = this.driver.secondName,
        firstName = this.driver.firstName,
        career = this.driver.career,
        fullName = this.driver.firstName + " " + this.driver.secondName;

      fb.driversCollection
        .doc(this.toEdit.id)
        .update({
          createdOn: new Date(),
          image: image,
          name: name,
          secondName: secondName,
          firstName: firstName,
          fullName: fullName,
          career: career
        })
        .then(() => {
          this.currentDriver = {};
          this.newImage = false;
          this.driver.image = "";
          this.driver.image = "";
          this.driver.fullName = "";
          this.driver.image = "";
          this.driver.firstName = "";
          this.driver.secondName = "";
        })
        .catch(err => {});
    },
    selectOption(id) {
      if (id) {
        fb.imageUrlCollection
          .doc(id)
          .get()
          .then(doc => {
            let image = doc.data();
            this.selectImage.selectedUrl = image.url;
            this.driver.image = image.url;
          })
          .catch(err => {});
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
