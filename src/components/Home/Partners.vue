<template>
  <div id="partners-sec" class="py-5 border-top border-bottom border-primary text-dark bg-white">
    <h2 class="pl-3 pb-5 font-weight-bold">Partners</h2>
    <div class="container-fluid pb-5">
      <div class="row">
        <div class="partner-logo col-2 col-md-1" v-for="(partner, index) in partners" :key="index">
          <img :src="partner.logo" class="img-fluid" @click="clickedPartner(partner)" />
        </div>
      </div>
    </div>
    <div id="partner-display" class="container" v-if="activePartner">
      <h3 class="text-center pb-5">{{ activePartner.name }}</h3>
      <div class="row">
        <div id="partner-logo-cont" class="col-6">
          <img :src="activePartner.logo" class="img-fluid" />
        </div>
        <div class="col-6">{{ activePartner.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      activePartner: {},
      partnerId: null
    };
  },
  computed: {
    ...mapState(["partners"])
  },
  methods: {
    clickedPartner(partner) {
      this.activePartner = partner;
    }
  }
};
</script>