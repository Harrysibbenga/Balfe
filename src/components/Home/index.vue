<template>
  <div>
    <comp-carousel />
    <comp-latest-news />
    <comp-media />
    <comp-drivers />
    <comp-upcoming-events />
    <comp-partners />
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
