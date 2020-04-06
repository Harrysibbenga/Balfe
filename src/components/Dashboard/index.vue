<template>
  <div class="container-fluid">
    <b-nav tabs>
      <b-nav-item to="/dashboard/posts">Posts</b-nav-item>
      <b-nav-item to="/dashboard/partners">Partners</b-nav-item>
      <b-nav-item to="/dashboard/drivers">Drivers</b-nav-item>
      <b-nav-item to="/dashboard/calender">Calender</b-nav-item>
      <b-nav-item to="/dashboard/history">History</b-nav-item>
      <b-nav-item to="/dashboard/media">Media</b-nav-item>
    </b-nav>
    <router-view></router-view>
  </div>
</template>
