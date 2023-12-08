<template>
  <div class="auth-layout-wrap" :style="{ backgroundImage: 'url(' + bgImage + ')' }">
    <div class="auth-content">
      <div class="card o-hidden">
        <div class="row">
          <div class="col-md-6 pb-4">
            <div class="p-4">
              <div class="auth-logo text-center mb-30">
                <img :src="logo" alt="" />
              </div>
              <h1 class="mb-3 text-18">Reset Password</h1>
              <ValidationObserver v-slot="{ handleSubmit }">
                <form @submit.prevent="handleSubmit(onSubmit)">
                  <div class="form-group">
                    <label for="password">Password</label>
                    <ValidationProvider ref="password" name="password" rules="required" v-slot="{ errors }">
                      <b-form-input class="form-control form-control-rounded" label="Password" type="password"
                        v-model.trim="form.password"></b-form-input>
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </div>
                  <div class="form-group">
                    <label for="repassword">Repeat Password</label>
                    <ValidationProvider ref="repassword" name="repeat password" rules="required|confirmed:password"
                      v-slot="{ errors }">
                      <b-form-input class="form-control form-control-rounded" label="Repeat Password" type="password"
                        v-model.trim="form.repassword"></b-form-input>
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
          <div class="col-md-6 text-center " style="background-size: cover"
            :style="{ backgroundImage: 'url(' + formImage + ')' }">
            <div class="pr-3 auth-right">
              <router-link :to="{ name: 'login' }"
                class="btn btn-outline-primary btn-outline-email btn-block btn-icon-text btn-rounded">
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
    title: "Reset Password"
  },
  created() {
    this.checkQuery()
  },
  data() {
    return {
      bgImage: require("@/assets/images/photo-wide-4.jpg"),
      logo: require("@/assets/images/logo.png"),
      formImage: require("@/assets/images/photo-long-3.jpg"),
      submitted: false,
      token: null,
      form: {
        password: null,
        repassword: null,
      }
    }
  },
  methods: {
    async onSubmit() {
      this.submitted = true

      let { data } = await this.axios.post('auth/password/reset',
        {
          token: this.token,
          password: this.form.password,
          password_confirmation: this.form.repassword,
        })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push('/auth/login')
      } else {
        if (data.data) {
          this.$refs.password.applyResult({ errors: data.data.password ?? [] })
          this.$refs.repassword.applyResult({ errors: data.data.password_confirmation ?? [] })
        } else {
          alert(data.message)
        }
      }

      this.submitted = false
    },
    checkQuery() {
      const tokenQuery = this.$route.query.token
      console.log(tokenQuery)
      if (!tokenQuery) this.$router.push('/auth/login')
      else this.token = tokenQuery
    }
  }
};
</script>
