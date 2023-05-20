<template>
  <div
    class="auth-layout-wrap"
    :style="{ backgroundImage: 'url(' + bgImage + ')' }"
  >
    <div class="auth-content">
      <div class="card o-hidden">
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="p-4">
              <div class="auth-logo text-center mb-30">
                <img :src="logo" alt="" />
              </div>
              <h1 class="mb-3 text-18">Forgot Password</h1>
              <ValidationObserver v-slot="{ handleSubmit }" ref="form">
                <form @submit.prevent="handleSubmit(onSubmit)">
                  <div class="form-group">
                    <label for="email">Email address</label>
                    <ValidationProvider ref="email" name="Email" rules="required|email" v-slot="{ errors }">
                      <input
                        id="email"
                        class="form-control form-control-rounded"
                        type="email"
                        v-model="form.email"
                      />
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </div>
                  <button type="submit" class="btn btn-primary btn-block btn-rounded mt-3">
                    Reset Password
                  </button>
                </form>
              </ValidationObserver>
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
    title: "Forgot Password"
  },
  data() {
    return {
      bgImage: require("@/assets/images/photo-wide-4.jpg"),
      logo: require("@/assets/images/logo.png"),
      formImage: require("@/assets/images/photo-long-3.jpg"),
      submitted: false,
      form: {
        email: null
      }
    }
  },
  methods: {
    async onSubmit() {
      this.submitted = true

      let { data } = await this.axios.get('auth/password/forgot',
        { params: { email: this.form.email }
      })

      if (data.status == "SUCCESS") {
        alert(data.message)

        this.form.email = null

        this.$nextTick(() => this.$refs.form.reset() )
      } else {
        if (data.data) {
          this.$refs.email.applyResult({ errors: data.data.email ?? [] })
        } else {
          alert(data.message)

          this.form.email = null
          this.$nextTick(() => this.$refs.form.reset() )
        }
      }

      this.submitted = false
    }
  }
};
</script>
