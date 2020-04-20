<template>
  <div class="text-left">
    <h1 class="text-left">Drivers</h1>
    <hr class="balfe-line" />
    <b-form @submit.prevent="submitHandler">
      <transition name="fade">
        <div v-if="request" class="loading">
          <p class="text-dark">Loading...</p>
        </div>
      </transition>

      <div class="container">
        <img :src="driver.image" class="img-fluid" />
      </div>

      <b-button class="btn btn-primary" @click="addNewImage($event)" value="driver">+ Image</b-button>

      <div class="col-12 p-0">
        <div class="row">
          <b-form-group
            id="firstName"
            label="First name"
            label-for="firstName"
            class="text-left col-12 col-sm-6"
          >
            <b-input id="firstName" v-model.trim="driver.firstName" type="text"></b-input>
          </b-form-group>

          <b-form-group
            id="secondName"
            label="Second name"
            label-for="secondName"
            class="text-left col-12 col-sm-6"
          >
            <b-input id="secondName" v-model.trim="driver.secondName" type="text"></b-input>
          </b-form-group>
        </div>
      </div>

      <b-form-group id="career" label="Career" label-for="career" class="text-left">
        <wysiwyg id="career" v-model="driver.career"></wysiwyg>
      </b-form-group>

      <b-button
        type="submit"
        :disabled="driver.firstName == '' || driver.secondName == ''"
        variant="primary"
      >Add driver</b-button>
    </b-form>

    <div v-if="driverAdded" class="text-sucsess">Driver has been added!</div>

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
              <img :src="driver.image" class="img-fluid" width="200px" />
            </td>
            <td v-html="driver.career"></td>
            <td>{{ driver.createdOn | formatCreation }}</td>
            <td>
              <div class="d-inline px-1 text-dark" @click="editdriver(driver)">Edit</div>
              <div class="d-inline px-1 text-primary" @click="deletedriver(driver)">Delete</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Sorry no drivers yet .......... Add some!</div>
    <!-- Models -->
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
        v-if="input == 'driver'"
      />

      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="close">Close</b-button>
      </div>

      <p class="text-success" v-if="confirmation">Image uploaded !</p>
    </b-modal>
    <!-- New image modal  -->
    <!-- Delete  -->
    <b-modal
      v-model="deleteDialog"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="lg"
    >
      <div class="d-block text-center">
        <p>
          Are you sure you want to delete this driver ? ( there's no turning
          back )
        </p>
      </div>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="deleteOnConfirm">Yes, delete</b-button>
        <b-button variant="primary" @click="deleteOnCancel">No, do not delete it</b-button>
      </div>
    </b-modal>
    <!-- Delete  -->
    <!-- Edit -->
    <b-modal
      v-model="editDialog"
      hide-header
      hide-footer
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
          <img :src="currentDriver.image" v-if="!newImage" class="img-fluid" />
          <img :src="driver.image" v-if="newImage" class="img-fluid" />
        </div>

        <b-button class="btn btn-primary" @click="addNewImage($event)" value="driver">+ Image</b-button>

        <b-button
          class="btn btn-primary ml-2"
          @click="chooseImage($event)"
          value="driver"
        >+ Select Image</b-button>

        <b-form-group id="firstName" label="First Name" label-for="firstName" class="text-left">
          <b-input
            id="firstName"
            v-model.trim="driver.firstName"
            type="text"
            :placeholder="currentDriver.firstName"
          ></b-input>
        </b-form-group>

        <b-form-group id="secondName" label="Second Name" label-for="secondName" class="text-left">
          <b-input
            id="secondName"
            v-model.trim="driver.secondName"
            type="text"
            :placeholder="currentDriver.secondName"
          ></b-input>
        </b-form-group>

        <b-form-group id="career" label="Career" label-for="career" class="text-left">
          <wysiwyg id="careerription" v-model="driver.career">
            {{
            currentDriver.career
            }}
          </wysiwyg>
        </b-form-group>
      </b-form>
      <div class="d-block text-right pt-3">
        <b-button class="mr-2" @click="editOnConfirm">Edit</b-button>
        <b-button variant="primary" @click="editOnCancel">Cancel</b-button>
      </div>
    </b-modal>
    <!-- Edit -->
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
      v-model="imageChoice"
      hide-header
      hide-footer
      centered
      no-close-on-backdrop
      hide-header-close
      no-close-on-esc
      size="xl"
    >
      <b-form-group label="Drivers">
        <b-form-radio-group id="radio" v-model="select" name="Drivers">
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
    <!-- Models  -->
  </div>
</template>

<script>
import moment from "moment";
const fb = require("../../../firebaseConfig");

export default {
  data() {
    return {
      driver: {
        image: "",
        imageId: "",
        firstName: "",
        secondName: "",
        career: ""
      },
      driverAdded: null,
      newImage: false,
      newImageUpload: false,
      imageId: null,
      userPrompt: false,
      deleteDialog: false,
      editDialog: false,
      currentDriver: {},
      toDelete: null,
      toEdit: null,
      select: null,
      imageChoice: null,
      input: null
    };
  },
  computed: {
    drivers() {
      return this.$store.getters["drivers/getDrivers"];
    },
    confirmation() {
      return this.$store.getters["images/confirmation"];
    },
    imageUrl() {
      return this.$store.getters["images/getDriverUrl"];
    },
    images() {
      return this.$store.getters["images/getDrivers"];
    },
    request() {
      return this.$store.getters["images/getRequest"];
    }
  },
  methods: {
    createDriver() {
      this.$store.commit("images/setRequest", true);
      fb.driversCollection
        .add({
          createdOn: new Date(),
          image: this.driver.image,
          imageId: this.driver.imageId,
          fullName: this.driver.firstName + " " + this.driver.secondName,
          firstName: this.driver.firstName,
          secondName: this.driver.secondName,
          career: this.driver.career
        })
        .then(() => {
          this.driverAdded = true;
          this.$refs.fileInput = "";
          this.driver.fullName = "";
          this.driver.image = "";
          this.driver.firstName = "";
          this.driver.secondName = "";
          this.driver.imageId = "";
          this.driver.career = "";
          this.imageId = null;
          this.$store.commit("images/setRequest", false);
          this.$store.commit("images/setDriverUrl", null);
          setInterval(() => {
            this.driverAdded = null;
          }, 3000);
        })
        .catch(error => console.log("create driver ", error.message));
    },
    submitHandler() {
      this.createDriver();
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
      this.driver.imageId = this.currentDriver.imageId;
    },
    editOnCancel() {
      this.editDialog = false;
      this.currentDriver = {};
      this.driver.image = "";
      this.driver.fullName = "";
      this.driver.image = "";
      this.driver.firstName = "";
      this.driver.secondName = "";
      this.driver.imageId = "";
      this.driver.career = "";
    },
    editOnConfirm() {
      this.editDialog = false;

      let image = this.driver.image,
        secondName = this.driver.secondName,
        firstName = this.driver.firstName,
        career = this.driver.career,
        fullName = this.driver.firstName + " " + this.driver.secondName,
        imageId = this.driver.imageId;

      fb.driversCollection
        .doc(this.toEdit.id)
        .update({
          createdOn: new Date(),
          image: image,
          imageId: imageId,
          secondName: secondName,
          firstName: firstName,
          fullName: fullName,
          career: career
        })
        .then(() => {
          this.currentDriver = {};
          this.newImage = false;
          this.imageId = "";
          this.driver.image = "";
          this.driver.imageId = "";
          this.driver.fullName = "";
          this.driver.firstName = "";
          this.driver.secondName = "";
          this.driver.career = "";
        })
        .catch(error => alert(error.message));
    },
    // adding a new image
    addNewImage(event) {
      if (event.target.value == "driver") {
        this.newImageUpload = true;
        this.input = "driver";
      }
    },
    //check the file to see if it exists
    checkFile(event) {
      let file = event.target.files[0];
      let exist = false;
      fb.driversImagesCollection
        .where("name", "==", file.name)
        .get()
        .then(docs => {
          docs.forEach(doc => {
            if (doc.exists) {
              exist = true;
              if (this.input == "driver") {
                this.driver.image = doc.data().url;
                this.newImage = true;
                this.imageId = doc.id;
                this.userPrompt = true;
                this.$store.commit("images/setDriverUrl", doc.data().url);
              }
              return;
            }
          });
        })
        .then(() => {
          if (!exist) {
            this.$store.dispatch("images/uploadDriverImage", file);
          }
        });
    },
    // prompt user that image exists
    decline() {
      if (this.input == "driver") {
        this.userPrompt = false;
        this.$store.commit("images/setDriverUrl", null);
        this.imageId = null;
        this.$refs.fileInput.value = "";
        this.driver.image = null;
        this.input == "";
        this.newImage = false;
      }
    },
    confirm() {
      if (this.input == "driver") {
        this.driver.image = this.$store.getters["images/getDriverUrl"];
        this.driver.imageId = this.imageId;
        this.userPrompt = false;
        this.$refs.fileInput.value = "";
        this.newImageUpload = false;
        this.$store.commit("images/setDriverUrl", null);
        this.newImage = true;
        this.input = "";
      }
    },
    close() {
      if (this.input == "driver") {
        let url = this.$store.getters["images/getDriverUrl"];
        this.driver.image = url;
        this.newImageUpload = false;
        fb.driversImagesCollection
          .where("url", "==", url)
          .get()
          .then(docs => {
            docs.forEach(doc => {
              this.driver.imageId = doc.id;
            });
          });
        this.$refs.fileInput.value = "";
        this.$store.commit("images/setDriverUrl", null);
        this.input = "";
      }
    },
    // select image
    chooseImage(event) {
      if (event.target.value == "driver") {
        this.imageChoice = true;
        this.select = this.currentDriver.imageId;
      }
    },
    confirmSelection() {
      if (this.imageChoice) {
        fb.driversImagesCollection
          .doc(this.select)
          .get()
          .then(doc => {
            let image = doc.data();
            this.newImage = true;
            this.driver.image = image.url;
            this.driver.imageId = doc.id;
          })
          .then(() => {
            this.imageChoice = false;
            this.select = null;
          });
      }
    },
    closeSel() {
      if (this.imageChoice) {
        this.imageChoice = false;
        this.select = null;
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
    this.$store.dispatch("drivers/setDrivers");
    this.$store.dispatch("images/setDriverImages");
  }
};
</script>

<style lang="css" scoped>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
.form-control.invalid {
  border: red 1.5px solid !important;
}
</style>
