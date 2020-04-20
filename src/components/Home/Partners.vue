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
    <div id="partner-display" class="container" v-if="activePartner">
      <h3 class="text-center pb-5">{{ activePartner.name }}</h3>
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
const fb = require("../../firebaseConfig");
export default {
  data() {
    return {
      activePartner: false,
      partnerId: null,
      partnerView: {}
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
    randomPartner() {
      fb.partnersCollection
        .orderBy("name")
        .get()
        .then(docs => {
          let allPartners = [];
          docs.forEach(doc => {
            let partner = doc.data();
            partner.id = doc.id;
            allPartners.push(partner);
          });
          let rand = Math.floor(Math.random() * allPartners.length);
          this.activePartner = allPartners[rand];
        });
    }
  },
  created: function() {
    this.$store.dispatch("partners/setPartners");
    this.randomPartner();
  },
  mounted() {}
};
</script>