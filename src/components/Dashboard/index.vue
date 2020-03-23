<template>
  <div class="container text-center">
    <b-nav tabs>
      <b-nav-item to="/dashboard/add_posts">Add post</b-nav-item>
      <b-nav-item to="/dashboard/list_posts">Manage posts</b-nav-item>
      <b-nav-item to="/dashboard/add_partners">Add partner</b-nav-item>
      <b-nav-item to="/dashboard/list_partners">Manage partners</b-nav-item>
      <b-nav-item to="/dashboard/drivers">Manage drivers</b-nav-item>
      <b-nav-item to="/dashboard/calender">Manage calender</b-nav-item>
      <b-nav-item to="/dashboard/media">Media</b-nav-item>
    </b-nav>
    <router-view></router-view>
  </div>
</template>
