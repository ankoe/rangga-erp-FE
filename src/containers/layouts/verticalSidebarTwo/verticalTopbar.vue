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
        <div class="dropdown">
          <b-dropdown class="m-md-2 user col align-self-end" variant="link" toggle-class="text-decoration-none" no-caret>
            <template #button-content>
              {{ getCurrency.symbol }}<span class="sr-only">{{ getCurrency.title }}</span>
            </template>
            <b-dropdown-item @click="onChangeCurrency('idr')">IDR | Indonesia Rupiah</b-dropdown-item>
            <b-dropdown-item @click="onChangeCurrency('usd')">USD | US Dolar</b-dropdown-item>
          </b-dropdown>
        </div>
        <!-- Notificaiton -->
        <div class="dropdown">
          <b-dropdown id="dropdown-1" text="Dropdown Button" class="m-md-2 badge-top-container"
            toggle-class="text-decoration-none" no-caret variant="link">
            <template slot="button-content">
              <span v-if="notificationCount" class="badge badge-primary">{{ notificationCount }}</span>
              <i class="i-Bell text-muted header-icon"></i>
            </template>
            <!-- Notification dropdown -->
            <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }" ref="myData"
              class="dropdown-menu-right rtl-ps-none notification-dropdown ps scroll">
              <!-- <div class="dropdown-menu-right rtl-ps-none notification-dropdown"> -->
              <div v-for="(notification, index) in notifications" :key="index" class="dropdown-item d-flex"
                @click="onClickNotification(notification)">
                <div class="notification-icon">
                  <i class="i-Speach-Bubble-6 text-primary mr-1"></i>
                </div>
                <div class="notification-details flex-grow-1">
                  <p class="m-0 d-flex align-items-center">
                    <span>{{ notification.title }}</span>
                    <!-- <span class="badge badge-pill badge-primary ml-1 mr-1">new</span> -->
                    <span class="flex-grow-1"></span>
                    <span class="text-small text-muted ml-auto">{{ notification.created_at | luxon({
                      output: {
                        format:
                          "relative"
                      }
                    }) }}</span>
                  </p>
                  <p class="text-small text-muted m-0">{{ notification.message }}</p>
                </div>
              </div>
              <!-- </div> -->
            </vue-perfect-scrollbar>
          </b-dropdown>
        </div>
        <!-- Notificaiton End -->

        <!-- User avatar dropdown -->
        <div class="dropdown">
          <b-dropdown id="dropdown-1" text="Dropdown Button" class="m-md-2 user col align-self-end"
            toggle-class="text-decoration-none" no-caret variant="link">
            <template slot="button-content">
              <img src="@/assets/images/faces/1.jpg" id="userDropdown" alt data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false" />
            </template>

            <div class="dropdown-menu-right" aria-labelledby="userDropdown">
              <div class="dropdown-header">
                <i class="i-Lock-User mr-1"></i> {{ name }}
              </div>
              <router-link tag="a" :to="{ name: 'profile-index' }" class="dropdown-item" href="#">
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
import { mapGetters, mapActions } from "vuex"
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
    getCurrency() {
      return this.currency == 'idr' ? { symbol: 'IDR', title: 'Rupiah Indonesia' } : { symbol: 'USD', title: 'Dolar Amerika' }
    }
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      isMegaMenuOpen: false,
      isSearchOpen: false,
      name: localStorage.getItem("name"),
      currency: 'idr',
      notifications: [],
      notificationCount: 0,
    };
  },
  mounted() {
    this.getNotificationsList()
    this.getNotificationsCount()
  },
  methods: {
    ...mapActions([
      "switchSidebar",
      "sidebarCompact",
      "removeSidebarCompact",
      "mobileSidebar",
      "changeCurrency"
    ]),

    handleFullScreen() {
      Util.toggleFullScreen();
    },
    compactSideBarToggle() {
      // console.log("hello");
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
    async getNotificationsList() {
      let { data } = await this.axios.get('notification', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.notifications = data.data
    },
    async getNotificationsCount() {
      let { data } = await this.axios.get('notification/count', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.notificationCount = data.data
    },
    async setRead(id) {
      await this.axios.get('notification/read/' + id, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.getNotificationsList()
      this.getNotificationsCount()
    },
    onChangeCurrency(currency) {
      this.currency = currency
      this.changeCurrency(currency)
    },
    onClickNotification(notification) {
      // this.setRead(notification.route_param.id)
      // dropdown di false
      this.$router.push({ name: notification.route, params: { id: notification.route_param.id ?? '' } })
    },
    logoutUser() {
      if (localStorage.length > 0) localStorage.clear()
      this.$router.push({ name: 'login' })
    }
  },
};
</script>>