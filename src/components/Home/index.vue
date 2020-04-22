<template>
  <div class="bg-dark text-white" id="home">
    <comp-carousel class="border-bottom border-primary" />
    <comp-latest-news
      id="news-sec"
      class="py-5 border-top border-bottom border-primary bg-white text-dark"
    />
    <comp-media id="media-sec" class="py-5 border-top border-bottom border-primary" />
    <comp-drivers
      id="drivers-sec"
      class="py-5 border-top border-bottom border-primary text-dark bg-white"
    />
    <comp-upcoming-events id="calender" class="py-5 border-top border-bottom border-primary" />
    <comp-partners
      id="partners-sec"
      class="py-5 border-top border-bottom border-primary text-dark bg-white"
    />
  </div>
</template>

<script>
import compCarousel from "./Carousel";
import compLatestNews from "./Latestnews";
import compMedia from "./Media";
import compDrivers from "./Drivers";
import compUpcomingEvents from "./Upcomingevents";
import compPartners from "./Partners";

export default {
  components: {
    compCarousel,
    compLatestNews,
    compMedia,
    compPartners,
    compUpcomingEvents,
    compDrivers
  }
};
</script>
