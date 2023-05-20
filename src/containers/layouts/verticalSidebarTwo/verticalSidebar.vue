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
            <li v-if="link.type == 'dropdown'" v-show="checkPermission(link.permission)" class="Ul_li--hover">
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
            <p v-else-if="link.type == 'header'" v-show="checkPermission(link.permission)" class="main-menu-title text-uppercase text-12 mt-4 mb-2">{{ link.title }}</p>
            <li v-else-if="link.type == 'link'" v-show="checkPermission(link.permission)" class="Ul_li--hover">
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
      permissions: [],
      links: [
        {
          type: 'link',
          title: 'Dashboard',
          url: { name: 'dashboard' },
          icon: 'i-Dashboard',
          permission: 'general',
        },
        {
          type: 'header',
          title: 'P2P'
        },
        {
          type: 'dropdown',
          title: 'Purchase Request',
          icon: 'i-Safe-Box1',
          permission: 'purchase request',
          children: [
            {
              title: 'List',
              url: { name: 'purchase-request-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Create',
              url: { name: 'purchase-request-create' },
              icon: 'i-Add',
            },
          ]
        },
        {
          type: 'header',
          title: 'Office Suppervisor'
        },
        {
          type: 'link',
          title: 'Purchase Request',
          url: { name: 'office-purchase-request-index' },
          icon: 'i-Letter-Open',
          permission: 'office purchase request',
        },
        {
          type: 'header',
          title: 'Procurement Officer'
        },
        {
          type: 'link',
          title: 'Purchase Request',
          url: { name: 'procurement-purchase-request-index' },
          icon: 'i-Letter-Open',
          permission: 'procurement purchase request',
        },
        {
          type: 'link',
          title: 'Request for Quotation',
          url: { name: 'procurement-request-for-quotation-index' },
          icon: 'i-Letter-Open',
          permission: 'procurement rfq',
        },
        {
          type: 'link',
          title: 'Purchase Order',
          url: { name: 'procurement-purchase-order-index' },
          icon: 'i-Letter-Open',
          permission: 'procurement po',
        },
        {
          type: 'link',
          title: 'Pesan',
          url: { name: 'procurement-message-index' },
          icon: 'i-Speach-Bubbles',
          permission: 'procurement message',
        },
        {
          type: 'header',
          title: 'Supplier'
        },
        {
          type: 'link',
          title: 'Offer',
          url: { name: 'supplier-offer-index' },
          icon: 'i-Letter-Open',
          permission: 'vendor offer',
        },
        {
          type: 'link',
          title: 'Supplier Winner',
          url: { name: 'supplier-winner-index' },
          icon: 'i-Letter-Open',
          permission: 'vendor offer',
        },
        {
          type: 'link',
          title: 'Pesan',
          url: { name: 'supplier-message-index' },
          icon: 'i-Speach-Bubbles',
          permission: 'vendor offer',
        },
        // {
        //   type: 'header',
        //   title: 'Data',
        //   permission: 'general',
        // },
        {
          type: 'dropdown',
          title: 'Material',
          icon: 'i-Safe-Box1',
          permission: 'material',
          children: [
            {
              title: 'List',
              url: { name: 'material-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Add',
              url: { name: 'material-create' },
              icon: 'i-Add',
            },
          ]
        },
        {
          type: 'dropdown',
          title: 'Material Category',
          icon: 'i-Safe-Box1',
          permission: 'material category',
          children: [
            {
              title: 'List',
              url: { name: 'material-category-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Add',
              url: { name: 'material-category-create' },
              icon: 'i-Add',
            },
          ]
        },
        {
          type: 'dropdown',
          title: 'Vendor',
          icon: 'i-Shop',
          permission: 'vendor',
          children: [
            {
              title: 'List',
              url: { name: 'vendor-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Add',
              url: { name: 'vendor-create' },
              icon: 'i-Add',
            },
          ]
        },
        {
          type: 'dropdown',
          title: 'Location',
          icon: 'i-Geo21',
          permission: 'location',
          children: [
            {
              title: 'List',
              url: { name: 'location-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Add',
              url: { name: 'location-create' },
              icon: 'i-Add',
            },
          ]
        },
        // {
        //   type: 'header',
        //   title: 'User Management',
        //   permission: 'general',
        // },
        {
          type: 'dropdown',
          title: 'User',
          icon: 'i-Administrator',
          permission: 'user',
          children: [
            {
              title: 'List',
              url: { name: 'user-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Add',
              url: { name: 'user-create' },
              icon: 'i-Add',
            },
          ]
        },
        {
          type: 'dropdown',
          title: 'Role',
          icon: 'i-Key',
          permission: 'role',
          children: [
            {
              title: 'List',
              url: { name: 'role-index' },
              icon: 'i-Safe-Box1',
            },
            {
              title: 'Add',
              url: { name: 'role-create' },
              icon: 'i-Add',
            },
          ]
        },
        // {
        //   type: 'header',
        //   title: 'Other',
        //   permission: 'general',
        // },
        {
          type: 'dropdown',
          title: 'Config',
          icon: 'i-Gear',
          permission: 'config approval',
          children: [
            {
              title: 'Approval',
              url: { name: 'config-approval' },
              icon: 'i-Drag',
            },
          ]
        },

      ]
    }
  },
  mounted() {
    this.toggleSelectedParentMenu();
    document.addEventListener("click", this.returnSelectedParentMenu)
    this.permissions = JSON.parse(localStorage.getItem("permissions"))
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
    checkPermission(permission) {
      return permission == 'general' || this.permissions.includes(permission)
    }
  },
};
</script>
<style>
</style>