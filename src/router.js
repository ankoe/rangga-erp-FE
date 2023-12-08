import Vue from "vue";
import store from "./store";
// import {isMobile} from "mobile-device-detect";
import Router from "vue-router";
import NProgress from "nprogress";
import authenticate from "./auth/authenticate";
import unauthenticate from "./auth/unauthenticate";

Vue.use(Router);

// create new router

const routes = [

  {
    path: "/",
    name: "home",
    component: () => import("./views/pages"), //webpackChunkName app
    beforeEnter: authenticate,
    redirect: "/dashboard",

    children: [
      // profile
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("./views/pages/dashboard"),
        beforeEnter: authenticate,
      },

      // profile
      {
        path: "profile",
        name: "profile-index",
        component: () => import("./views/pages/profile/index"),
        beforeEnter: authenticate,
      },
      {
        path: "profile/edit",
        name: "profile-edit",
        component: () => import("./views/pages/profile/edit"),
        beforeEnter: authenticate,
      },
      {
        path: "profile/password",
        name: "profile-password",
        component: () => import("./views/pages/profile/password"),
        beforeEnter: authenticate,
      },

      // role
      {
        path: "role",
        name: "role-index",
        component: () => import("./views/pages/role/index"),
        beforeEnter: authenticate,
      },
      {
        path: "role/create",
        name: "role-create",
        component: () => import("./views/pages/role/create"),
        beforeEnter: authenticate,
      },
      {
        path: "role/:id",
        name: "role-detail",
        component: () => import("./views/pages/role/detail"),
        beforeEnter: authenticate,
      },
      {
        path: "role/:id/edit",
        name: "role-edit",
        component: () => import("./views/pages/role/edit"),
        beforeEnter: authenticate,
      },

      // user
      {
        path: "user",
        name: "user-index",
        component: () => import("./views/pages/user/index"),
        beforeEnter: authenticate,
      },
      {
        path: "user/create",
        name: "user-create",
        component: () => import("./views/pages/user/create"),
        beforeEnter: authenticate,
      },
      {
        path: "user/:id",
        name: "user-detail",
        component: () => import("./views/pages/user/detail"),
        beforeEnter: authenticate,
      },
      {
        path: "user/:id/edit",
        name: "user-edit",
        component: () => import("./views/pages/user/edit"),
        beforeEnter: authenticate,
      },

      // location
      {
        path: "location",
        name: "location-index",
        component: () => import("./views/pages/location/index"),
        beforeEnter: authenticate,
      },
      {
        path: "location/create",
        name: "location-create",
        component: () => import("./views/pages/location/create"),
        beforeEnter: authenticate,
      },
      {
        path: "location/:id",
        name: "location-detail",
        component: () => import("./views/pages/location/detail"),
        beforeEnter: authenticate,
      },
      {
        path: "location/:id/edit",
        name: "location-edit",
        component: () => import("./views/pages/location/edit"),
        beforeEnter: authenticate,
      },

      // material category
      {
        path: "material-category",
        name: "material-category-index",
        component: () => import("./views/pages/material/category/index"),
        beforeEnter: authenticate,
      },
      {
        path: "material-category/create",
        name: "material-category-create",
        component: () => import("./views/pages/material/category/create"),
        beforeEnter: authenticate,
      },
      {
        path: "material-category/:id",
        name: "material-category-detail",
        component: () => import("./views/pages/material/category/detail"),
        beforeEnter: authenticate,
      },
      {
        path: "material-category/:id/edit",
        name: "material-category-edit",
        component: () => import("./views/pages/material/category/edit"),
        beforeEnter: authenticate,
      },

      // material request for admin
      {
        path: "material/request",
        name: "material-material-request-index",
        component: () => import("./views/pages/material/material_request/index"),
        beforeEnter: authenticate,
      },
      {
        path: "material/request/:id",
        name: "material-material-request-process",
        component: () => import("./views/pages/material/material_request/process"),
        beforeEnter: authenticate,
      },

      // material
      {
        path: "material",
        name: "material-index",
        component: () => import("./views/pages/material/index"),
        beforeEnter: authenticate,
      },
      {
        path: "material/create",
        name: "material-create",
        component: () => import("./views/pages/material/create"),
        beforeEnter: authenticate,
      },
      {
        path: "material/:id",
        name: "material-detail",
        component: () => import("./views/pages/material/detail"),
        beforeEnter: authenticate,
      },
      {
        path: "material/:id/edit",
        name: "material-edit",
        component: () => import("./views/pages/material/edit"),
        beforeEnter: authenticate,
      },

       // Material request for user
       {
        path: "material-request",
        name: "material-request-index",
        component: () => import("./views/pages/material_request/index"),
        beforeEnter: authenticate,
      },
      {
        path: "material-request/create",
        name: "material-request-create",
        component: () => import("./views/pages/material_request/create"),
        beforeEnter: authenticate,
      },

      // vendor
      {
        path: "vendor",
        name: "vendor-index",
        component: () => import("./views/pages/vendor/index"),
        beforeEnter: authenticate,
      },
      {
        path: "vendor/create",
        name: "vendor-create",
        component: () => import("./views/pages/vendor/create"),
        beforeEnter: authenticate,
      },
      {
        path: "vendor/:id",
        name: "vendor-detail",
        component: () => import("./views/pages/vendor/detail"),
        beforeEnter: authenticate,
      },
      {
        path: "vendor/:id/edit",
        name: "vendor-edit",
        component: () => import("./views/pages/vendor/edit"),
        beforeEnter: authenticate,
      },

      // unit
      {
        path: "unit",
        name: "unit-index",
        component: () => import("./views/pages/unit/index"),
        beforeEnter: authenticate,
      },
      {
        path: "unit/create",
        name: "unit-create",
        component: () => import("./views/pages/unit/create"),
        beforeEnter: authenticate,
      },
      {
        path: "unit/:id",
        name: "unit-detail",
        component: () => import("./views/pages/unit/detail"),
        beforeEnter: authenticate,
      },
      {
        path: "unit/:id/edit",
        name: "unit-edit",
        component: () => import("./views/pages/unit/edit"),
        beforeEnter: authenticate,
      },

      // purchase request
      {
        path: "purchase-request",
        name: "purchase-request-index",
        component: () => import("./views/pages/purchase_request/index"),
        beforeEnter: authenticate,
      },
      {
        path: "purchase-request/create",
        name: "purchase-request-create",
        component: () => import("./views/pages/purchase_request/create"),
        beforeEnter: authenticate,
      },
      {
        path: "purchase-request/:id",
        name: "purchase-request-detail",
        component: () => import("./views/pages/purchase_request/detail"),
        beforeEnter: authenticate,
      },
      {
        path: "purchase-request/:id/item/create",
        name: "purchase-request-item-create",
        component: () => import("./views/pages/purchase_request/item_create"),
        beforeEnter: authenticate,
      },
      {
        path: "purchase-request/:id/item/:item",
        name: "purchase-request-item-edit",
        component: () => import("./views/pages/purchase_request/item_edit"),
        beforeEnter: authenticate,
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
        beforeEnter: authenticate,
      },


      // office: purchase request
      {
        path: "office/purchase-request",
        name: "office-purchase-request-index",
        component: () => import("./views/pages/office/purchase_request/index"),
        beforeEnter: authenticate,
      },
      {
        path: "office/purchase-request/:id",
        name: "office-purchase-request-detail",
        component: () => import("./views/pages/office/purchase_request/detail"),
        beforeEnter: authenticate,
      },

      // Procurement: purchase request
      {
        path: "procurement/purchase-request",
        name: "procurement-purchase-request-index",
        component: () => import("./views/pages/procurement/purchase_request/index"),
        beforeEnter: authenticate,
      },
      {
        path: "procurement/purchase-request/:id",
        name: "procurement-purchase-request-detail",
        component: () => import("./views/pages/procurement/purchase_request/detail"),
        beforeEnter: authenticate,
      },

      // Procurement: request for quotation
      {
        path: "procurement/request-for-quotation",
        name: "procurement-request-for-quotation-index",
        component: () => import("./views/pages/procurement/request_for_quotation/index"),
        beforeEnter: authenticate,
      },
      {
        path: "procurement/request-for-quotation/:id",
        name: "procurement-request-for-quotation-detail",
        component: () => import("./views/pages/procurement/request_for_quotation/detail"),
        beforeEnter: authenticate,
      },

      // Procurement: Purchase Order
      {
        path: "procurement/purchase-order",
        name: "procurement-purchase-order-index",
        component: () => import("./views/pages/procurement/purchase_order/index"),
        beforeEnter: authenticate,
      },
      {
        path: "procurement/purchase-order/:id",
        name: "procurement-purchase-order-detail",
        component: () => import("./views/pages/procurement/purchase_order/detail"),
        beforeEnter: authenticate,
      },

      // message
      {
        path: "mesage",
        name: "auth-message-index",
        component: () => import("./views/pages/message"),
        beforeEnter: authenticate,
      },

      // Vendor: Offer
      {
        path: "supplier/offer",
        name: "supplier-offer-index",
        component: () => import("./views/pages/supplier/offer/index"),
        beforeEnter: authenticate,
      },
      {
        path: "supplier/offer/:id",
        name: "supplier-offer-detail",
        component: () => import("./views/pages/supplier/offer/detail"),
        beforeEnter: authenticate,
      },

      // Vendor: Supplier Winner
      {
        path: "supplier/winner",
        name: "supplier-winner-index",
        component: () => import("./views/pages/supplier/supplier_winner/index"),
        beforeEnter: authenticate,
      },
      {
        path: "supplier/winner/:id",
        name: "supplier-winner-detail",
        component: () => import("./views/pages/supplier/supplier_winner/detail"),
        beforeEnter: authenticate,
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
        component: () => import("./views/pages/auth/login"),
        beforeEnter: unauthenticate,
      },
      {
        path: "register",
        name: "register",
        component: () => import("./views/pages/auth/register"),
        beforeEnter: unauthenticate,
      },
      {
        path: "activation",
        name: "activation-resend",
        component: () => import("./views/pages/auth/activationResend"),
        beforeEnter: unauthenticate,
      },
      {
        path: "activation/confirmation",
        name: "activation-confirmation",
        component: () => import("./views/pages/auth/activationSubmit"),
        beforeEnter: unauthenticate,
      },
      {
        path: "password",
        name: "password-forgot",
        component: () => import("./views/pages/auth/passwordForgot"),
        beforeEnter: unauthenticate,
      },
      {
        path: "password/reset",
        name: "password-reset",
        component: () => import("./views/pages/auth/passwordReset"),
        beforeEnter: unauthenticate,
      },
    ]
  },

  // vendor-access
  {
    path: "/vendor-access",
    component: () => import("./views/pages/vendor_access"),
    redirect: "/auth/login",
    children: [
      {
        path: ":slug",
        name: "vendor-access-dashboard",
        component: () => import("./views/pages/vendor_access/dashboard")
      },
      {
        path: ":slug/request-for-quotation",
        name: "vendor-access-request-for-quotation-index",
        component: () => import("./views/pages/vendor_access/request_for_quotation/index")
      },
      {
        path: ":slug/request-for-quotation/:id",
        name: "vendor-access-request-for-quotation-detail",
        component: () => import("./views/pages/vendor_access/request_for_quotation/detail")
      },
      {
        path: ":slug/purchase-order",
        name: "vendor-access-purchase-order-index",
        component: () => import("./views/pages/vendor_access/purchase_order/index")
      },
      {
        path: ":slug/purchase-order/:id",
        name: "vendor-access-purchase-order-detail",
        component: () => import("./views/pages/vendor_access/purchase_order/detail")
      },
      // Procurement: message
      {
        path: ":slug/mesage",
        name: "vendor-access-message-index",
        component: () => import("./views/pages/vendor_access/message"),
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
  scrollBehavior() {
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
