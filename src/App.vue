<template>
  <div id="app">
    <comp-header />
    <router-view />
    <comp-footer />
  </div>
</template>

<script>
import compHeader from "./components/Header-Foooter/header";
import compFooter from "./components/Header-Foooter/footer";
export default {
  components: {
    compHeader,
    compFooter
  }
};
</script>

