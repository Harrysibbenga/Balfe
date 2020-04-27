<template>
  <div>
    <h1 class="text-left">Welcome {{ userProfile.name }} to the Balfe Motorsport dashboard</h1>
    <hr class="balfe-line" />
  </div>
</template>

<script>
export default {
  computed: {
    userProfile() {
      return this.$store.getters["admin/getUserProfile"];
    }
  }
};
</script>