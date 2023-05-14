import Vue from "vue";
import store from "./store";
// import {isMobile} from "mobile-device-detect";
import Router from "vue-router";
import NProgress from "nprogress";
// import authenticate from "./auth/authenticate";

Vue.use(Router);

// create new router

const routes = [
  // {
  //   path: "/",
  //   name: "dashboard",
  //   component: () => import("./views/app"), //webpackChunkName app
  //   // beforeEnter: authenticate,
  //   redirect: "/app/pages/blank",
  // },

  {
    path: "/",
    name: "home",
    component: () => import("./views/pages"), //webpackChunkName app
    // beforeEnter: authenticate,
    redirect: "/dashboard",

    children: [
      // profile
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("./views/pages/dashboard")
      },

      // profile
      {
        path: "profile",
        name: "profile-index",
        component: () => import("./views/pages/profile/index")
      },
      {
        path: "profile/edit",
        name: "profile-edit",
        component: () => import("./views/pages/profile/edit")
      },
      {
        path: "profile/password",
        name: "profile-password",
        component: () => import("./views/pages/profile/password")
      },

      // role
      {
        path: "role",
        name: "role-index",
        component: () => import("./views/pages/role/index")
      },
      {
        path: "role/create",
        name: "role-create",
        component: () => import("./views/pages/role/create")
      },
      {
        path: "role/:id",
        name: "role-detail",
        component: () => import("./views/pages/role/detail"),
      },
      {
        path: "role/:id/edit",
        name: "role-edit",
        component: () => import("./views/pages/role/edit")
      },

      // user
      {
        path: "user",
        name: "user-index",
        component: () => import("./views/pages/user/index")
      },
      {
        path: "user/create",
        name: "user-create",
        component: () => import("./views/pages/user/create")
      },
      {
        path: "user/:id",
        name: "user-detail",
        component: () => import("./views/pages/user/detail"),
      },
      {
        path: "user/:id/edit",
        name: "user-edit",
        component: () => import("./views/pages/user/edit")
      },

      // location
      {
        path: "location",
        name: "location-index",
        component: () => import("./views/pages/location/index")
      },
      {
        path: "location/create",
        name: "location-create",
        component: () => import("./views/pages/location/create")
      },
      {
        path: "location/:id",
        name: "location-detail",
        component: () => import("./views/pages/location/detail"),
      },
      {
        path: "location/:id/edit",
        name: "location-edit",
        component: () => import("./views/pages/location/edit")
      },

      // material
      {
        path: "material-category",
        name: "material-category-index",
        component: () => import("./views/pages/material/category/index")
      },
      {
        path: "material-category/create",
        name: "material-category-create",
        component: () => import("./views/pages/material/category/create")
      },
      {
        path: "material-category/:id",
        name: "material-category-detail",
        component: () => import("./views/pages/material/category/detail")
      },
      {
        path: "material-category/:id/edit",
        name: "material-category-edit",
        component: () => import("./views/pages/material/category/edit")
      },

      // material
      {
        path: "material",
        name: "material-index",
        component: () => import("./views/pages/material/index"),
      },
      {
        path: "material/create",
        name: "material-create",
        component: () => import("./views/pages/material/create")
      },
      {
        path: "material/:id",
        name: "material-detail",
        component: () => import("./views/pages/material/detail")
      },
      {
        path: "material/:id/edit",
        name: "material-edit",
        component: () => import("./views/pages/material/edit")
      },

      // vendor
      {
        path: "vendor",
        name: "vendor-index",
        component: () => import("./views/pages/vendor/index")
      },
      {
        path: "vendor/create",
        name: "vendor-create",
        component: () => import("./views/pages/vendor/create")
      },
      {
        path: "vendor/:id",
        name: "vendor-detail",
        component: () => import("./views/pages/vendor/detail"),
      },
      {
        path: "vendor/:id/edit",
        name: "vendor-edit",
        component: () => import("./views/pages/vendor/edit")
      },

      // purchase request
      {
        path: "purchase-request",
        name: "purchase-request-index",
        component: () => import("./views/pages/purchase_request/index"),
      },
      {
        path: "purchase-request/create",
        name: "purchase-request-create",
        component: () => import("./views/pages/purchase_request/create")
      },
      {
        path: "purchase-request/:id",
        name: "purchase-request-detail",
        component: () => import("./views/pages/purchase_request/detail"),
      },
      {
        path: "purchase-request/:id/item/create",
        name: "purchase-request-item-create",
        component: () => import("./views/pages/purchase_request/item_create")
      },
      {
        path: "purchase-request/:id/item/:item",
        name: "purchase-request-item-edit",
        component: () => import("./views/pages/purchase_request/item_edit")
      },

      // rfq
      {
        path: "rfq",
        name: "rfq-index",
        component: () => import("./views/pages/rfq/index"),
      },
      {
        path: "rfq/:id",
        name: "rfq-detail",
        component: () => import("./views/pages/rfq/detail"),
      },

      // config
      {
        path: "config",
        name: "config-index",
        // component: () => import("./views/pages/purchase_request/index"),
        redirect: "config/approval",
      },
      {
        path: "config/approval",
        name: "config-approval",
        component: () => import("./views/pages/config/approval"),
      },

    ]
  },

  // auth
  {
    path: "/auth",
    component: () => import("./views/pages/auth"),
    redirect: "/auth/login",
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("./views/pages/auth/login")
      },
      {
        path: "register",
        name: "register",
        component: () => import("./views/pages/auth/register")
      },
      {
        path: "activation",
        name: "activation-resend",
        component: () => import("./views/pages/auth/activationResend")
      },
      {
        path: "activation/confirmation",
        name: "activation-confirmation",
        component: () => import("./views/pages/auth/activationSubmit")
      },
      {
        path: "password",
        name: "password-forgot",
        component: () => import("./views/pages/auth/passwordForgot")
      },
      {
        path: "password/reset",
        name: "password-reset",
        component: () => import("./views/pages/auth/passwordReset")
      },
    ]
  },




  {
    path: "*",
    component: () => import("./views/app/pages/notFound")
  }
];

const router = new Router({
  mode: "history",
  linkActiveClass: "open",
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0};
  }
});

router.beforeEach((to, from, next) => {
  // If this isn't an initial page load.
  if (to.path) {
    // Start the route progress bar.

    NProgress.start();
    NProgress.set(0.1);
  }
  next();
});

router.afterEach(() => {
  // Remove initial loading
  const gullPreLoading = document.getElementById("loading_wrap");
  if (gullPreLoading) {
    gullPreLoading.style.display = "none";
  }
  // Complete the animation of the route progress bar.
  setTimeout(() => NProgress.done(), 500);
  // NProgress.done();
  // if (isMobile) {
  if (window.innerWidth <= 1200) {
    // console.log("mobile");
    store.dispatch("changeSidebarProperties");
    if (store.getters.getSideBarToggleProperties.isSecondarySideNavOpen) {
      store.dispatch("changeSecondarySidebarProperties");
    }

    if (store.getters.getCompactSideBarToggleProperties.isSideNavOpen) {
      store.dispatch("changeCompactSidebarProperties");
    }
  } else {
    if (store.getters.getSideBarToggleProperties.isSecondarySideNavOpen) {
      store.dispatch("changeSecondarySidebarProperties");
    }

    // store.state.sidebarToggleProperties.isSecondarySideNavOpen = false;
  }
});

export default router;
