<template>
  <div id="drivers-sec" class="py-5 border-top border-bottom border-primary text-dark bg-white">
    <h2 class="pl-3 pb-5 font-weight-bold">Drivers</h2>
    <div class="container-fluid p-0">
      <div class="row no-gutters">
        <div class="col-lg-12">
          <div class="row no-gutters" v-if="drivers.length > 0">
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
        <div id="driver-sec" class="col-md-12" v-if="currentDriver != null">
          <div class="row no-gutters">
            <div class="col-md-6 view">
              <img class="img-fluid" :src="currentDriver.image" />
            </div>
            <div class="col-md-6">
              <div class="text-center">
                <h3 class="name-title">{{ currentDriver.fullName }}</h3>
              </div>
              <div class="container-fluid">
                <h4 class="px-5 pb-2">Career Highlight</h4>
                <div class="px-5" v-html="currentDriver.career"></div>
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
    }
  },
  methods: {
    clickedDriver(driver) {
      this.currentDriver = driver;
    },
    defaultDriver() {
      this.currentDriver = this.drivers[0];
    }
  },
  created() {
    this.$store.dispatch("drivers/setDrivers");
    setTimeout(() => {
      this.defaultDriver();
    }, 1000);
  }
};
</script>