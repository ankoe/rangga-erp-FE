<template>
  <div class="mb-30 m-4">
    <header class="main-header vertical-header bg-white d-flex justify-content-between rounded-0">
      <div class="menu-toggle vertical-toggle" @click="mobileSidebar">
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div style="margin: auto"></div>

      <div class="header-part-right">
        <!-- Full screen toggle -->
        <i class="i-Full-Screen header-icon d-none d-sm-inline-block" @click="handleFullScreen"></i>
        <!-- Notificaiton -->
        <div class="dropdown">
          <b-dropdown
            id="dropdown-1"
            text="Dropdown Button"
            class="m-md-2 badge-top-container"
            toggle-class="text-decoration-none"
            no-caret
            variant="link"
          >
            <template slot="button-content">
              <span class="badge badge-primary">3</span>
              <i class="i-Bell text-muted header-icon"></i>
            </template>
            <!-- Notification dropdown -->
            <vue-perfect-scrollbar
              :settings="{ suppressScrollX: true, wheelPropagation: false }"
              ref="myData"
              class="dropdown-menu-right rtl-ps-none notification-dropdown ps scroll"
            >
              <!-- <div class="dropdown-menu-right rtl-ps-none notification-dropdown"> -->
              <div class="dropdown-item d-flex">
                <div class="notification-icon">
                  <i class="i-Speach-Bubble-6 text-primary mr-1"></i>
                </div>
                <div class="notification-details flex-grow-1">
                  <p class="m-0 d-flex align-items-center">
                    <span>New message</span>
                    <!-- <span class="badge badge-pill badge-primary ml-1 mr-1">new</span> -->
                    <span class="flex-grow-1"></span>
                    <span class="text-small text-muted ml-auto">10 sec ago</span>
                  </p>
                  <p class="text-small text-muted m-0">James: Hey! are you busy?</p>
                </div>
              </div>
              <div class="dropdown-item d-flex">
                <div class="notification-icon">
                  <i class="i-Receipt-3 text-success mr-1"></i>
                </div>
                <div class="notification-details flex-grow-1">
                  <p class="m-0 d-flex align-items-center">
                    <span>New order received</span>
                    <!-- <span class="badge badge-pill badge-success ml-1 mr-1">new</span> -->
                    <span class="flex-grow-1"></span>
                    <span class="text-small text-muted ml-auto">2 hours ago</span>
                  </p>
                  <p class="text-small text-muted m-0">1 Headphone, 3 iPhone x</p>
                </div>
              </div>
              <div class="dropdown-item d-flex">
                <div class="notification-icon">
                  <i class="i-Empty-Box text-danger mr-1"></i>
                </div>
                <div class="notification-details flex-grow-1">
                  <p class="m-0 d-flex align-items-center">
                    <span>Product out of stock</span>
                    <!-- <span class="badge badge-pill badge-danger ml-1 mr-1">3</span> -->
                    <span class="flex-grow-1"></span>
                    <span class="text-small text-muted ml-auto">10 hours ago</span>
                  </p>
                  <p class="text-small text-muted m-0">Headphone E67, R98, XL90, Q77</p>
                </div>
              </div>
              <div class="dropdown-item d-flex">
                <div class="notification-icon">
                  <i class="i-Data-Power text-success mr-1"></i>
                </div>
                <div class="notification-details flex-grow-1">
                  <p class="m-0 d-flex align-items-center">
                    <span>Server Up!</span>
                    <!-- <span class="badge badge-pill badge-success ml-1 mr-1">3</span> -->
                    <span class="flex-grow-1"></span>
                    <span class="text-small text-muted ml-auto">14 hours ago</span>
                  </p>
                  <p class="text-small text-muted m-0">Server rebooted successfully</p>
                </div>
              </div>
              <!-- </div> -->
            </vue-perfect-scrollbar>
          </b-dropdown>
        </div>
        <!-- Notificaiton End -->

        <!-- User avatar dropdown -->
        <div class="dropdown">
          <b-dropdown
            id="dropdown-1"
            text="Dropdown Button"
            class="m-md-2 user col align-self-end"
            toggle-class="text-decoration-none"
            no-caret
            variant="link"
          >
            <template slot="button-content">
              <img
                src="@/assets/images/faces/1.jpg"
                id="userDropdown"
                alt
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              />
            </template>

            <div class="dropdown-menu-right" aria-labelledby="userDropdown">
              <div class="dropdown-header">
                <i class="i-Lock-User mr-1"></i> Timothy Carlson
              </div>
              <router-link tag="a" :to="{ name: 'profile.index' }" class="dropdown-item" href="#">
                Profile
              </router-link>
              <a class="dropdown-item" href="#" @click.prevent="logoutUser">Log out</a>
            </div>
          </b-dropdown>
        </div>
      </div>
      <search-component :isSearchOpen.sync="isSearchOpen" @closeSearch="toggleSearch"></search-component>
    </header>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Util from "@/utils";
import searchComponent from "../common/search";
export default {
  components: {
    searchComponent,
  },
  computed: {
    ...mapGetters([
      "getVerticalCompact",
      "getVerticalSidebar",
      "getSideBarToggleProperties",
    ]),
  },
  data() {
    return {
      isMegaMenuOpen: false,
      isSearchOpen: false,
    };
  },
  methods: {
    ...mapActions([
      "switchSidebar",
      "sidebarCompact",
      "removeSidebarCompact",
      "mobileSidebar",
    ]),

    handleFullScreen() {
      Util.toggleFullScreen();
    },
    compactSideBarToggle() {
      console.log("hello");
    },
    closeMegaMenu() {
      this.isMegaMenuOpen = false;
      // console.log(this.isMouseOnMegaMenu);
      // if (!this.isMouseOnMegaMenu) {
      //   this.isMegaMenuOpen = !this.isMegaMenuOpen;
      // }
    },
    toggleMegaMenu() {
      this.isMegaMenuOpen = !this.isMegaMenuOpen;
    },
    toggleSearch() {
      this.isSearchOpen = !this.isSearchOpen;
    },
  },
};
</script>>