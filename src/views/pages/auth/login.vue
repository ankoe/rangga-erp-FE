<template>
  <div class="auth-layout-wrap" :style="{ backgroundImage: 'url(' + bgImage + ')' }">
    <div class="auth-content">
      <div class="card o-hidden">
        <div class="row">
          <div class="col-md-6">
            <div class="p-4">
              <div class="auth-logo text-center mb-30">
                <img :src="logo" />
              </div>
              <h1 class="mb-3 text-18">Login</h1>
              <ValidationObserver v-slot="{ handleSubmit }">
                <b-form @submit.prevent="handleSubmit(onSubmit)">
                  <b-form-group label="Email Address" class="text-12">
                    <ValidationProvider ref="email" name="Email" rules="required|email" v-slot="{ errors }">
                      <b-form-input class="form-control-rounded" type="email" v-model="form.email" />
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-form-group label="Password" class="text-12">
                    <ValidationProvider ref="password" name="Password" rules="required" v-slot="{ errors }">
                      <b-form-input class="form-control-rounded" type="password" v-model="form.password" />
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-button type="submit" tag="button" class="btn-rounded btn-block mt-2" variant="primary mt-2"
                    :disabled="loading">Send</b-button>
                  <div v-once class="typo__p" v-if="loading">
                    <div class="spinner sm spinner-primary mt-3"></div>
                  </div>
                </b-form>
              </ValidationObserver>

              <div class="mt-3 text-center">
                <router-link :to="{ name: 'password-forgot' }" tag="a" class="text-muted">
                  <u>Forgot Password?</u>
                </router-link>
              </div>
            </div>
          </div>

          <b-col md="6" class="text-center" style="backgroundSize: cover;"
            :style="{ backgroundImage: 'url(' + signInImage + ')' }">
            <div class="pr-3 auth-right">
              <router-link :to="{ name: 'register' }"
                class="btn btn-rounded btn-outline-primary btn-outline-email btn-block btn-icon-text">
                Create an account
              </router-link>
            </div>
          </b-col>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex"

export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Login",
  },
  data() {
    return {
      form: {
        email: null,
        password: null
      },
      bgImage: require("@/assets/images/photo-wide-4.jpg"),
      logo: require("@/assets/images/logo.png"),
      signInImage: require("@/assets/images/photo-long-3.jpg"),
      loading: false
    }
  },

  methods: {
    ...mapActions([
      "syncRate",
    ]),
    async onSubmit() {
      this.loading = true

      let { data } = await this.axios.post('auth/login', {
        email: this.form.email,
        password: this.form.password
      })

      if (data.status == "SUCCESS") {
        // sementara, harusnya lewat store
        localStorage.setItem("name", data.data.name)
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("permissions", JSON.stringify(data.data.permissions))
        this.syncRate()
        this.$router.push({ name: 'dashboard' })
      } else {
        if (data.data) {
          this.$refs.email.applyResult({ errors: data.data.email ?? [] })
          this.$refs.password.applyResult({ errors: data.data.password ?? [] })
        } else {
          alert(data.message)
        }

        this.form.password = null
      }

      this.loading = false
    },
  },
};
</script>

<style>
.spinner.sm {
  height: 2em;
  width: 2em;
}
</style>
