<template>
  <div>
    <h1 class="text-left">History</h1>
    <hr class="balfe-line" />
    <b-nav tabs>
      <b-nav-item to="/dashboard/history/add_history">Add history</b-nav-item>
      <b-nav-item to="/dashboard/history/list_history">Manage history posts</b-nav-item>
    </b-nav>
    <router-view></router-view>
  </div>
</template>