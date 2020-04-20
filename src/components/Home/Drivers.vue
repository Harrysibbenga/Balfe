<template>
  <div id="drivers-sec" class="py-5 border-top border-bottom border-primary text-dark bg-white">
    <h2 class="pl-3 pb-5 font-weight-bold">Drivers</h2>
    <div class="container-fluid p-0">
      <div class="row no-gutters">
        <div class="col-lg-12">
          <div class="row no-gutters">
            <div
              class="driver-cont-container col-4 col-lg-2 view"
              v-for="(driver, index) in drivers"
              :key="index"
              @click="clickedDriver(driver)"
            >
              <img class="img-fluid" :src="driver.image" />
              <div class="text-container text-center mask overflow-hidden">
                <div class="d-flex h-100">
                  <h3 class="title text-primary mt-auto">{{ driver.firstName }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="driver-sec" class="col-md-12" v-if="currentDriver">
          <div class="row no-gutters">
            <div class="col-md-6 view">
              <img class="img-fluid" :src="currentDriver.image" />
            </div>
            <div class="col-md-6">
              <div class="text-center">
                <h3 class="name-title">{{ currentDriver.fullName }}</h3>
              </div>
              <div class="container-fluid">
                <h4 class>Career Highlight</h4>
                <ul id="career-highlight" class="list-group list-group-flush"></ul>
              </div>
            </div>
          </div>
        </div>
        <div id="driver-sec" class="col-md-12" v-if="currentDriver == null">
          <div class="row no-gutters">
            <div class="col-md-6 view">
              <img class="img-fluid" :src="defultDriver.image" />
            </div>
            <div class="col-md-6">
              <div class="text-center">
                <h3 class="name-title">{{ defultDriver.fullName }}</h3>
              </div>
              <div class="container-fluid">
                <h4 class>Career Highlight</h4>
                <ul id="career-highlight" class="list-group list-group-flush"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentDriver: null
    };
  },
  computed: {
    drivers() {
      return this.$store.getters["drivers/getDrivers"];
    },
    defultDriver() {
      return this.$store.getters["drivers/getDrivers"][0];
    }
  },
  methods: {
    clickedDriver(driver) {
      this.currentDriver = driver;
    }
  },
  created: function() {
    this.$store.dispatch("drivers/setDrivers");
  }
};
</script>