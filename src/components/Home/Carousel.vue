<template>
  <div>
    <b-carousel
      id="carousel-intro"
      v-model="slide"
      :interval="3000"
      background="black"
      width="2560"
      height="1250"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
      fade
      no-hover-pause
    >
      <!-- Latest article -->
      <b-carousel-slide>
        <template v-slot:img>
          <img class="d-block img-fluid w-100" width="2560" height="1250" src alt />
          <div class="mask"></div>
          <div class="container-fluid mb-5 text-container text-center text-white">
            <div class="row">
              <div class="partner-logo col-12 col-md-12 col-lg-6">
                <h1 class="h1">Flewitt Racing and Sky VIP partner up for 2020 campaign</h1>
                <p class="excerpt">
                  Double Pure McLaren GT Series champion Mia Flewitt will
                  partner with Sky and its VIP loyalty programme as she competes
                  in her McLaren 570S GT4 with Balfe Motorsport in the British
                  GT Championship‘s GT4 Pro-Am class alongside Euan Hankey, for
                  the 2020 season.
                </p>
                <p class="date">19 Feb 2020</p>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <div class="row">
                  <div class="col-6 p-0">
                    <app-button
                      type="link"
                      :linkTo="selectedHistory.link"
                      :addClass="['btn-md']"
                    >View</app-button>
                  </div>
                  <div class="col-6 p-0">
                    <app-button
                      type="link"
                      :linkTo="selectedHistory.link"
                      :addClass="['btn-md']"
                    >View All</app-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </b-carousel-slide>

      <!-- History -->
      <b-carousel-slide>
        <template v-slot:img>
          <img class="d-block img-fluid w-100" width="2560" height="1250" src />
          <div class="mask"></div>
          <div class="container-fluid mb-5 text-container text-center text-white">
            <div class="row">
              <div class="partner-logo col-12 col-md-12 col-lg-6">
                <h1 class="h1">{{ selectedHistory.title }}</h1>
                <p class="excerpt">{{ selectedHistory.excerpt }}</p>
                <p class="date">{{ selectedHistory.date }}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <div class="row">
                  <div class="col-6 p-0">
                    <app-button
                      type="link"
                      :linkTo="selectedHistory.link"
                      :addClass="['btn-md']"
                    >View</app-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </b-carousel-slide>

      <!-- Partners -->
      <b-carousel-slide>
        <template v-slot:img>
          <img class="d-block img-fluid w-100" width="2560" height="1250" src />
          <div class="mask"></div>
          <div class="container-fluid mb-5 text-container text-center text-white">
            <div class="row">
              <div class="partner-logo col-12 col-md-12 col-lg-6">
                <h1 class="h1">{{ selectedPartner.title }}</h1>
                <p class="excerpt">{{ selectedPartner.excerpt }}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <div class="row">
                  <div class="col-6 p-0">
                    <app-button
                      type="link"
                      :linkTo="selectedPartner.link"
                      :addClass="['btn-md']"
                    >View</app-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slide: 0,
      sliding: null,
      historyCont: [
        {
          alt: "",
          excerpt:
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendiss eros felis, tincidunt a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.",
          link: "#",
          date: "19 Feb 2018",
          title: "History title 1"
        },
        {
          alt: "",
          excerpt:
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendiss eros felis, tincidunt a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.",
          link: "#",
          date: "19 Dec 2019",
          title: "History title 2"
        }
      ],
      partnerCont: [
        {
          alt: "",
          excerpt:
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendiss eros felis, tincidunt a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.",
          link: "#",
          title: "Partners"
        },
        {
          alt: "",
          excerpt:
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendiss eros felis, tincidunt a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.",
          link: "#",
          title: "Building your Brand"
        },
        {
          alt: "",
          excerpt:
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendiss eros felis, tincidunt a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.",
          link: "#",
          title: "Hospitailty and Networking"
        },
        {
          alt: "",
          excerpt:
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendiss eros felis, tincidunt a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.",
          link: "#",
          title: "Staff Motivation and Team Work"
        }
      ],
      selectedHistory: "",
      selectedPartner: ""
    };
  },
  methods: {
    onSlideStart() {
      let historyId = Math.floor(Math.random() * this.historyCont.length);
      let partnerId = Math.floor(Math.random() * this.partnerCont.length);
      this.selectedHistory = this.historyCont[historyId];
      this.selectedPartner = this.partnerCont[partnerId];
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
    }
  },
  created() {
    let historyId = Math.floor(Math.random() * this.historyCont.length);
    let partnerId = Math.floor(Math.random() * this.partnerCont.length);
    this.selectedHistory = this.historyCont[historyId];
    this.selectedPartner = this.partnerCont[partnerId];
  }
};
</script>
