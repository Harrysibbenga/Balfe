import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";

import Home from "@/components/Home/index";
import Login from "@/components/Login/index";
import NotFound from "@/components/404/index";
import Post from "@/components/Post/index"
// Dashboard
import Dashboard from "@/components/Dashboard/index";
import MainDashboard from "@/components/Dashboard/welcome";
// Posts
import Posts from "@/components/Dashboard/Posts/index"
import AddPost from "@/components/Dashboard/Posts/addPost";
import ListPosts from "@/components/Dashboard/Posts/listPosts";
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
    }, {
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