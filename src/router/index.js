import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";

import Home from "@/components/Home/index";
import Login from "@/components/Login/index";
import NotFound from "@/components/404/index";
import Post from "@/components/Post/Post";
import AllPosts from "@/components/Post/allPosts";
import History from "@/components/History/Post";
import AllHistoricPosts from "@/components/History/allPosts";
// Dashboard
import Dashboard from "@/components/Dashboard/index";
import MainDashboard from "@/components/Dashboard/welcome";
// Posts
import Posts from "@/components/Dashboard/Posts/index"
import AddPost from "@/components/Dashboard/Posts/addPost";
import ListPosts from "@/components/Dashboard/Posts/listPosts";
//Historic 
import Historic from "@/components/Dashboard/History/index"
import AddHistory from "@/components/Dashboard/History/addHistory"
import ListHistory from "@/components/Dashboard/History/listHistory"
//Partners
import Partners from "@/components/Dashboard/Partners/index"
import AddPartners from '@/components/Dashboard/Partners/addPartner';
import ListPartners from '@/components/Dashboard/Partners/listPartners';
//Media
import Media from '@/components/Dashboard/Media/index'
import Gallery from "@/components/Dashboard/Media/Gallery/index"
import Logos from "@/components/Dashboard/Media/Logos/index"
import Videos from "@/components/Dashboard/Media/Videos/index"
import Images from "@/components/Dashboard/Media/Images/index"
//Drivers
import Drivers from "@/components/Dashboard/Drivers/index";
//Calender
import Calender from "@/components/Dashboard/Calender/index"
Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [{
      path: "*",
      component: NotFound
    },
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    }, {
      path: '/post/:id',
      name: 'post',
      component: Post
    },
    {
      path: '/all_posts',
      name: 'all_posts',
      component: AllPosts
    },
    {
      path: '/history/:id',
      name: 'history_post',
      component: History
    },
    {
      path: '/all_posts',
      name: 'historic_posts',
      component: AllHistoricPosts
    },
    {
      path: "/dashboard",
      component: Dashboard,
      children: [{
          path: "/",
          component: MainDashboard
        },
        {
          path: "posts",
          component: Posts,
          children: [{
              path: "add_posts",
              component: AddPost
            },
            {
              path: "list_posts",
              component: ListPosts
            }
          ]
        },
        {
          path: "history",
          component: Historic,
          children: [{
              path: "add_history",
              component: AddHistory
            },
            {
              path: "list_history",
              component: ListHistory
            }
          ]
        },
        {
          path: "partners",
          component: Partners,
          children: [{
            path: "add_partners",
            component: AddPartners
          }, {
            path: "list_partners",
            component: ListPartners
          }]
        }, {
          path: "drivers",
          component: Drivers
        }, {
          path: "calender",
          component: Calender
        }, {
          path: "media",
          component: Media,
          children: [{
              path: "/",
              component: Gallery
            }, {
              path: "images",
              component: Images
            }, {
              path: "videos",
              component: Videos
            },
            {
              path: "logos",
              component: Logos
            }
          ]
        }
      ],
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;