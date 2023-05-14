<template>
  <div class="auth-layout-wrap" :style="{ backgroundImage: 'url(' + bgImage + ')' }">
    <div class="auth-content">
      <div class="card o-hidden">
        <div class="row">
          <div
            class="col-md-6 text-center"
            style="background-size: cover"
            :style="{ backgroundImage: 'url(' + signInImage + ')' }"
          >
            <div class="pl-3 auth-right">
              <div class="auth-logo text-center mt-4">
                <img :src="logo" alt />
              </div>
              <div class="flex-grow-1"></div>
              <div class="w-100 mb-30">
                <router-link
                  :to="{ name: 'login' }"
                  class="btn btn-outline-primary btn-outline-email btn-block btn-icon-text btn-rounded"
                >
                  Login
                </router-link>
              </div>
              <div class="flex-grow-1"></div>
            </div>
          </div>

          <b-col md="6">
            <div class="p-4">
              <h1 class="mb-3 text-18">Register</h1>
              <ValidationObserver v-slot="{ handleSubmit }" ref="form">
                <b-form @submit.prevent="handleSubmit(onSubmit)">
                  <b-form-group label="Name">
                    <ValidationProvider ref="name" name="Name" rules="required|alpha_spaces|max:40" v-slot="{ errors }">
                      <b-form-input
                        class="form-control form-control-rounded"
                        label="Name"
                        v-model.trim="form.name"
                      ></b-form-input>
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-form-group label="Email">
                    <ValidationProvider ref="email" name="Email" rules="required|email" v-slot="{ errors }">
                      <b-form-input
                        class="form-control form-control-rounded"
                        label="Email"
                        type="email"
                        v-model="form.email"
                      ></b-form-input>
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-form-group label="Phone">
                    <ValidationProvider ref="mobile" name="Phone" rules="required|numeric|min:11|max:13" v-slot="{ errors }">
                      <b-form-input
                        class="form-control form-control-rounded"
                        label="Phone"
                        v-model.trim="form.mobile"
                      ></b-form-input>
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-form-group label="Password">
                    <ValidationProvider ref="password" name="Pasword" rules="required"  vid="password" v-slot="{ errors }">
                      <b-form-input
                        class="form-control form-control-rounded"
                        label="Password"
                        type="password"
                        v-model.trim="form.password"
                      ></b-form-input>
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-form-group label="Repeat Password">
                    <ValidationProvider ref="repassword" name="Repeat Password" rules="required|confirmed:password" v-slot="{ errors }">
                      <b-form-input
                        class="form-control form-control-rounded"
                        label="Repeat Password"
                        type="password"
                        v-model.trim="form.repassword"
                      ></b-form-input>
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-form-group label="Company">
                    <ValidationProvider ref="company" name="Company" rules="required|alpha_spaces|max:100" v-slot="{ errors }">
                      <b-form-input
                        class="form-control form-control-rounded"
                        label="Company"
                        v-model.trim="form.company"
                      ></b-form-input>
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-button
                    type="submit"
                    block
                    variant="primary"
                    :disabled="submitted"
                    class="btn-rounded"
                  >Send</b-button>
                </b-form>
              </ValidationObserver>
            </div>
          </b-col>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex"
export default {
  metaInfo: {
    title: "registration",
  },

  data() {
    return {
      form: {
        name: null,
        email: null,
        mobile: null,
        password: null,
        repassword: null,
        company: null,
      },
      bgImage: require("@/assets/images/photo-wide-4.jpg"),
      logo: require("@/assets/images/logo.png"),
      signInImage: require("@/assets/images/photo-long-3.jpg"),
      submitted: false,
    };
  },

  computed: {
    ...mapGetters(["loggedInUser", "loading", "error"]),
  },

  methods: {
    ...mapActions(["signUserUp"]),
    async onSubmit() {
      this.submitted = true

      let { data } = await this.axios.post('auth/register', {
        name: this.form.name,
        email: this.form.email,
        mobile: this.form.mobile,
        password: this.form.password,
        password_confirmation: this.form.repassword,
        company: this.form.company,
      })

      if (data.status == "SUCCESS") {
        alert(data.message)

        this.form.name = this.form.email = this.form.mobile = null
        this.form.password = this.form.password_confirmation = this.form.company = null

        this.$nextTick(() => this.$refs.form.reset() )
      } else {
        if (data.data) {
          this.$refs.name.applyResult({ errors: data.data.name ?? [] })
          this.$refs.email.applyResult({ errors: data.data.email ?? [] })
          this.$refs.mobile.applyResult({ errors: data.data.mobile ?? [] })
          this.$refs.password.applyResult({ errors: data.data.password ?? [] })
          this.$refs.repassword.applyResult({ errors: data.data.password_confirmation ?? [] })
          this.$refs.company.applyResult({ errors: data.data.company ?? [] })
        } else {
          alert(data.message)
        }
      }

      this.submitted = false
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


