<template>
  <vue-perfect-scrollbar
    class="sidebar-panel rtl-ps-none ps scroll"
    @mouseleave.native="sidebarCompact();returnSelectedParentMenu()"
    @mouseenter.native="removeSidebarCompact"
    :class="{
      'vertical-sidebar-compact': getVerticalCompact.isSidebarCompact,
      'sidebar-full-collapse': getVerticalSidebar.isMobileCompact
    }"
    :settings="{ suppressScrollX : true ,  wheelPropagation: false}"
  >
    <div>
      <div
        class="gull-brand text-center d-flex align-items-center pl-2 mb-2 justify-content-between"
      >
        <div>
          <img class src="@/assets/images/logo.png" />
        </div>
      </div>

      <div class="close-mobile-menu" @click="mobileSidebar">
        <i class="text-16 text-white i-Close-Window font-weight-bold"></i>
      </div>

      <div class="mt-4 main-menu">
        <ul class="ul-vertical-sidebar pl-4" id="menu">
          <template v-for="(link, index) in links">
            <li v-if="link.type == 'dropdown'" class="Ul_li--hover">
              <div v-b-toggle="'collapse-' + index">
                <a class="has-arrow" href="#" :class="{ active: selectedParentMenu == 'pages' }">
                  <i v-if="link.icon" :class="['nav-icon text-17 mr-3', link.icon]"></i>
                  <span
                    class="text-14"
                    :class="{ 'vertical-item-name': getVerticalCompact.isItemName }"
                  >{{ link.title }}</span>
                  <arrowIcon />
                </a>
              </div>
              <b-collapse :id="'collapse-' + index">
                <ul
                  class="Ul_collapse"
                  :class="{ 'vertical-item-name': getVerticalCompact.isItemName }"
                >
                  <li v-for="(child, i) in link.children" class="item-name">
                    <router-link tag="a" :to="child.url" class href="">
                      <i v-if="child.icon" :class="['nav-icon', child.icon]"></i>
                      <span class="item-name ml-1">{{ child.title }}</span>
                    </router-link>
                  </li>
                </ul>
              </b-collapse>
            </li>
            <p v-else-if="link.type == 'header'" class="main-menu-title text-uppercase text-12 mt-4 mb-2">{{ link.title }}</p>
            <li v-else-if="link.type == 'link'" class="Ul_li--hover">
              <router-link tag="a" :to="link.url"  class="has-arrow" href="">
                <i v-if="link.icon" :class="['nav-icon text-17 mr-3', link.icon]"></i>
                <span
                  class="text-14"
                  :class="{ 'vertical-item-name': getVerticalCompact.isItemName }"
                >{{ link.title }}</span>
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </vue-perfect-scrollbar>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import arrowIcon from "@/components/arrow/arrowIcon";
export default {
  components: {
    arrowIcon,
  },
  computed: {
    ...mapGetters(["getVerticalCompact", "getVerticalSidebar"]),
  },
  data() {
    return {
      selectedParentMenu: "",
      links: [
        {
          type: 'link',
          title: 'Dashboard',
          url: { name: 'dashboard' },
          icon: 'i-Safe-Box1'
        },
        {
          type: 'header',
          title: 'P2P'
        },
        {
          type: 'dropdown',
          title: 'Purchase Request',
          icon: 'i-Safe-Box1',
          children: [
            {
              title: 'Purchase Request List',
              url: { name: 'purchase-request-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Create Purchase request',
              url: { name: 'purchase-request-create' },
              icon: 'i-Safe-Box1',
            },
          ]
        },
        {
          type: 'link',
          title: 'RFQ',
          url: { name: 'rfq-index' },
          icon: 'i-Safe-Box1'
        },
        {
          type: 'header',
          title: 'Data'
        },
        {
          type: 'dropdown',
          title: 'Material',
          icon: 'i-Safe-Box1',
          children: [
            {
              title: 'Material List',
              url: { name: 'material-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Material Add',
              url: { name: 'material-create' },
              icon: 'i-Safe-Box1',
            },
          ]
        },
        {
          type: 'dropdown',
          title: 'Material Category',
          icon: 'i-Safe-Box1',
          children: [
            {
              title: 'Material Category List',
              url: { name: 'material-category-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Material Category Add',
              url: { name: 'material-category-create' },
              icon: 'i-Safe-Box1',
            },
          ]
        },
        {
          type: 'dropdown',
          title: 'Vendor',
          icon: 'i-Safe-Box1',
          children: [
            {
              title: 'Vendor List',
              url: { name: 'vendor-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Vendor Add',
              url: { name: 'vendor-create' },
              icon: 'i-Safe-Box1',
            },
          ]
        },
        {
          type: 'dropdown',
          title: 'Location',
          icon: 'i-Safe-Box1',
          children: [
            {
              title: 'Location List',
              url: { name: 'location-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Location Add',
              url: { name: 'location-create' },
              icon: 'i-Safe-Box1',
            },
          ]
        },
        {
          type: 'header',
          title: 'User Management'
        },
        {
          type: 'dropdown',
          title: 'User',
          icon: 'i-Safe-Box1',
          children: [
            {
              title: 'User List',
              url: { name: 'user-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'User Add',
              url: { name: 'user-create' },
              icon: 'i-Safe-Box1',
            },
          ]
        },
        {
          type: 'dropdown',
          title: 'Role',
          icon: 'i-Safe-Box1',
          children: [
            {
              title: 'Role List',
              url: { name: 'role-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Role Add',
              url: { name: 'role-create' },
              icon: 'i-Safe-Box1',
            },
          ]
        },
        {
          type: 'header',
          title: 'Other'
        },
        {
          type: 'dropdown',
          title: 'Config',
          icon: 'i-Safe-Box1',
          children: [
            {
              title: 'Approval',
              url: { name: 'config-approval' },
              icon: 'i-Safe-Box1',
            },
          ]
        },

      ]
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
        // this.selectedParentMenu = currentParentUrl.toLowerCase();
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
<style>
</style>