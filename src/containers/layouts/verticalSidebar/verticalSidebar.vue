<template>
  <vue-perfect-scrollbar class="sidebar-panel rtl-ps-none ps scroll"
    @mouseleave.native="sidebarCompact(); returnSelectedParentMenu()" @mouseenter.native="removeSidebarCompact" :class="{
      'vertical-sidebar-compact': getVerticalCompact.isSidebarCompact,
      'sidebar-full-collapse': getVerticalSidebar.isMobileCompact
    }" :settings="{ suppressScrollX: true, wheelPropagation: false }">
    <div>
      <div class="gull-brand text-center d-flex align-items-center pl-2 mb-2 justify-content-between">
        <div>
          <img class src="@/assets/images/logo.png" />
        </div>
      </div>

      <div class="close-mobile-menu" @click="mobileSidebar">
        <i class="text-16 text-primary i-Close-Window font-weight-bold"></i>
      </div>

      <div class="mt-4 main-menu">
        <ul class="ul-vertical-sidebar pl-4" id="menu">
          <!-- <p class="main-menu-title text-muted ml-3 font-weight-700 text-13 mt-4 mb-2">Apps</p> -->

          <!-- <p class="main-menu-title text-muted ml-3 font-weight-700 text-13 mt-4 mb-2">UI Elements</p> -->
          <li class="Ul_li--hover">
            <router-link tag="a" :to="{ name: 'vendor-access-dashboard' }" class="has-arrow" href="">
              <i class="nav-icon i-Dashboard text-20 mr-2 text-muted"></i>
              <span class="text-15 text-muted" :class="{ 'vertical-item-name': getVerticalCompact.isItemName }">
                Dashboard
              </span>
            </router-link>
          </li>
          <li class="Ul_li--hover">
            <router-link tag="a" :to="{ name: 'vendor-access-request-for-quotation-index' }" class="has-arrow" href="">
              <i class="nav-icon i-Letter-Open text-20 mr-2 text-muted"></i>
              <span class="text-15 text-muted" :class="{ 'vertical-item-name': getVerticalCompact.isItemName }">
                Request for Quotation
              </span>
            </router-link>
          </li>
          <li class="Ul_li--hover">
            <router-link tag="a" :to="{ name: 'vendor-access-purchase-order-index' }" class="has-arrow" href="">
              <i class="nav-icon i-Letter-Open text-20 mr-2 text-muted"></i>
              <span class="text-15 text-muted" :class="{ 'vertical-item-name': getVerticalCompact.isItemName }">
                Purchase Order
              </span>
            </router-link>
          </li>
          <li class="Ul_li--hover">
            <router-link tag="a" :to="{ name: 'vendor-access-message-index' }" class="has-arrow" href="">
              <i class="nav-icon i-Speach-Bubbles text-20 mr-2 text-muted"></i>
              <span class="text-15 text-muted" :class="{ 'vertical-item-name': getVerticalCompact.isItemName }">
                Message
              </span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </vue-perfect-scrollbar>
</template>
<script>
import { mapGetters, mapActions } from "vuex"
export default {
  components: {
  },
  computed: {
    ...mapGetters(["getVerticalCompact", "getVerticalSidebar"]),
  },
  data() {
    return {
      selectedParentMenu: "",
    };
  },
  mounted() {
    this.toggleSelectedParentMenu();
    document.addEventListener("click", this.returnSelectedParentMenu);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.returnSelectedParentMenu);
  },
  methods: {
    ...mapActions([
      "switchSidebar",
      "sidebarCompact",
      "removeSidebarCompact",
      "mobileSidebar",
    ]),

    toggleSelectedParentMenu() {
      const currentParentUrl = this.$route.path
        .split("/")
        .filter((x) => x !== "")[1];

      if (currentParentUrl !== undefined || currentParentUrl !== null) {
        this.selectedParentMenu = currentParentUrl.toLowerCase();
      } else {
        this.selectedParentMenu = "dashboards";
      }
    },
    returnSelectedParentMenu() {
      this.toggleSelectedParentMenu();
    },
  },
};
</script>
<style></style>