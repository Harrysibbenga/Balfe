import Vue from 'vue';
import Vuex from 'vuex';
import admin from './Modules/admin';
import posts from './Modules/posts';
// import images from "./Modules/images";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        admin,
        posts
        // images
    }
})