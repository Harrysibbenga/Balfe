<template>
  <div id="partners-sec" class="py-5 border-top border-bottom border-primary text-dark bg-white">
    <h2 class="pl-3 pb-5 font-weight-bold">Partners</h2>
    <div class="container-fluid pb-5">
      <div class="row">
        <div class="partner-logo col-4 col-lg-2" v-for="(partner, index) in partners" :key="index">
          <img :src="partner.logoUrl" class="img-fluid" @click="clickedPartner(partner)" />
        </div>
      </div>
    </div>
    <h3 class="text-center pb-5">{{ activePartner.name }}</h3>
    <div id="partner-display" class="container" v-if="activePartner">
      <div class="col-12 p-0">
        <div class="row">
          <div id="partner-logo-cont" class="col-12 col-sm-6">
            <img :src="activePartner.logoUrl" class="img-fluid" />
          </div>
          <div class="col-12 col-sm-6" v-html="activePartner.desc"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activePartner: {},
      partnerId: null
    };
  },
  computed: {
    partners() {
      return this.$store.getters["partners/getPartners"];
    }
  },
  methods: {
    clickedPartner(partner) {
      this.activePartner = partner;
    },
    randomPartner(partners) {
      let rand = Math.floor(Math.random() * partners.length);
      console.log(rand);
      for (let i = 0; i < partners.length; i++) {
        if (rand == i) {
          this.activePartner = partners[i];
        }
      }
    }
  },
  created: function() {
    this.$store.dispatch("partners/setPartners");
    let partners = this.$store.getters["partners/getPartners"];
    this.randomPartner(partners);
  }
};
</script>