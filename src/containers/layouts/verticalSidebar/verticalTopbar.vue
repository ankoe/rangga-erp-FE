<template>
  <div class="mb-30">
    <header class="main-header vertical-header bg-white d-flex justify-content-between">
      <div class="menu-toggle vertical-toggle" @click="mobileSidebar">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="header-toggle">

      </div>
      <div style="margin: auto"></div>

      <div class="header-part-right">
        <!-- Full screen toggle -->
        <i class="i-Full-Screen header-icon d-none d-sm-inline-block mr-3" @click="handleFullScreen"></i>
        <!-- <i class="i-Full-Screen header-icon d-none d-sm-inline-block" data-fullscreen></i> -->
        <!-- Grid menu Dropdown -->
      </div>
    </header>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Util from "@/utils";

export default {
  computed: {
    ...mapGetters(["getVerticalCompact", "getVerticalSidebar", "getSideBarToggleProperties"])
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(["switchSidebar", "sidebarCompact", "removeSidebarCompact", "mobileSidebar"]),

    handleFullScreen() {
      Util.toggleFullScreen();
    },
  }
};
</script>>