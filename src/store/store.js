import Vue from 'vue';
import Vuex from 'vuex';
import admin from './Modules/admin';
import posts from './Modules/posts';
import images from "./Modules/images";
import partners from "./Modules/partners";
import drivers from "./Modules/drivers";
import calender from "./Modules/calender";
import history from "./Modules/history";
import gallery from "./Modules/gallery";
import videos from "./Modules/videos";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        admin,
        posts,
        images,
        partners,
        drivers,
        calender,
        history,
        gallery,
        videos
    }
})