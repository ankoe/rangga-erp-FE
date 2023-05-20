<template>
  <div
    class="auth-layout-wrap"
    :style="{ backgroundImage: 'url(' + bgImage + ')' }"
  >
    <div class="auth-content">
      <div class="card o-hidden">
        <div class="row">
          <div class="col-md-6">
            <div class="p-4">
              <div class="auth-logo text-center mb-30">
                <img :src="logo" alt="" />
              </div>
              <h1 class="mb-3 text-18 text-center">Activation Account</h1>
              <div v-if="result != null" class="mt-3 text-center">
                <div v-if="result" class="alert alert-success">successfully activated, continue to login</div>
                <div v-else class="alert alert-danger">{{ message }}</div>
              </div>
              <div v-else class="mt-3 text-center text-info">
                <p>Loading...</p>
              </div>
            </div>
          </div>
          <div
            class="col-md-6 text-center "
            style="background-size: cover"
            :style="{ backgroundImage: 'url(' + formImage + ')' }"
          >
            <div class="pr-3 auth-right">
              <router-link
                :to="{ name: 'login' }"
                class="btn btn-outline-primary btn-outline-email btn-block btn-icon-text btn-rounded"
              >
                Login
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Activation Account"
  },
  data() {
    return {
      bgImage: require("@/assets/images/photo-wide-4.jpg"),
      logo: require("@/assets/images/logo.png"),
      formImage: require("@/assets/images/photo-long-3.jpg"),
      result: null,
      message: null
    };
  },
  mounted() {
    if (this.$route.query.token) {
      this.onSubmit()
    } else {
      this.$router.push({ name: 'login' })
    }
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.get('auth/activation/submit',
        { params: { token: this.$route.query.token }
      })

      if (data.status == 'SUCCESS') {
        this.result = true
      } else {
        this.result = false
        this.message = data.message
      }
    }
  }
};
</script>
