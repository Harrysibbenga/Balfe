<template>
  <div>
    <h1 class="text-left">Media Section</h1>
    <hr class="balfe-line" />
    <b-nav tabs>
      <b-nav-item to="/dashboard/media/">Gallery</b-nav-item>
      <b-nav-item to="/dashboard/media/images">Images</b-nav-item>
      <b-nav-item to="/dashboard/media/videos">Videos</b-nav-item>
      <b-nav-item to="/dashboard/media/logos">Logos</b-nav-item>
    </b-nav>
    <router-view></router-view>
  </div>
</template>