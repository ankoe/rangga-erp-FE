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
                  to="signIn"
                  class="btn btn-outline-primary btn-outline-email btn-block btn-icon-text btn-rounded"
                  href="signin.html"
                >
                  <i class="i-Mail-with-At-Sign"></i> Sign in with Email
                </router-link>
                <a
                  class="btn btn-outline-primary btn-outline-google btn-block btn-icon-text btn-rounded"
                >
                  <i class="i-Google-Plus"></i> Sign in with Google
                </a>
                <a
                  class="btn btn-outline-primary btn-outline-facebook btn-block btn-icon-text btn-rounded"
                >
                  <i class="i-Facebook-2"></i> Sign in with Facebook
                </a>
              </div>
              <div class="flex-grow-1"></div>
            </div>
          </div>

          <b-col md="6">
            <div class="p-4">
              <h1 class="mb-3 text-18">Sign Up</h1>
              <ValidationObserver v-slot="{ handleSubmit }">
                <b-form @submit.prevent="handleSubmit(onSubmit)">
                  <b-form-group label="Your Name">
                    <ValidationProvider name="E-mail" rules="required|email" v-slot="{ errors }">
                      <b-form-input
                        class="form-control form-control-rounded"
                        label="Name"
                        v-model.trim="$v.fName.$model"
                      ></b-form-input>
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-form-group label="Email">
                    <ValidationProvider name="E-mail" rules="required|email" v-slot="{ errors }">
                      <b-form-input
                        class="form-control form-control-rounded"
                        label="Name"
                        type="email"
                        v-model="email"
                      ></b-form-input>
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-form-group label="Password">
                    <ValidationProvider name="E-mail" rules="required|email" v-slot="{ errors }">
                      <b-form-input
                        class="form-control form-control-rounded"
                        label="Name"
                        type="password"
                        v-model.trim="$v.password.$model"
                      ></b-form-input>
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-form-group label="Repeat Password">
                    <ValidationProvider name="E-mail" rules="required|email" v-slot="{ errors }">
                      <b-form-input
                        class="form-control form-control-rounded"
                        label="Name"
                        type="password"
                        v-model.trim="$v.repeatPassword.$model"
                      ></b-form-input>
                      <span class="text-danger small">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>

                  <b-button
                    type="submit"
                    block
                    variant="primary"
                    :disabled="submitStatus === 'PENDING' || $v.$invalid"
                    class="btn-rounded"
                  >Sign Up</b-button>

                  <p v-once class="typo__p" v-if="submitStatus === 'OK'">
                    {{ makeToastTwo("success") }}
                    {{ this.$router.push("/") }}
                  </p>
                  <p v-once class="typo__p" v-if="submitStatus === 'ERROR'">{{ makeToast("danger") }}</p>
                  <div v-once class="typo__p" v-if="submitStatus === 'PENDING'">
                    <div class="spinner sm spinner-primary mt-3"></div>
                  </div>
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
import { mapGetters, mapActions } from "vuex";
export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "SignUp",
  },

  data() {
    return {
      fName: "",
      email: "",
      bgImage: require("@/assets/images/photo-wide-4.jpg"),
      logo: require("@/assets/images/logo.png"),
      signInImage: require("@/assets/images/photo-long-3.jpg"),
      password: "",
      repeatPassword: "",
      submitStatus: null,
    };
  },

  computed: {
    ...mapGetters(["loggedInUser", "loading", "error"]),
  },

  methods: {
    ...mapActions(["signUserUp"]),
    //   validate form
    onSubmit() {
      console.log("submit!");

      // this.$v.$touch();
      // if (this.$v.$invalid) {
      //   this.submitStatus = "ERROR";
      // } else {
      //   this.signUserUp({ email: this.email, password: this.password });
      //   this.submitStatus = "PENDING";
      //   setTimeout(() => {
      //     this.submitStatus = "OK";
      //   }, 1000);
      // }
    },
    makeToast(variant = null) {
      // this.$bvToast.toast("Please fill the form correctly.", {
      //   title: `Variant ${variant || "default"}`,
      //   variant: variant,
      //   solid: true,
      // });
    },
    makeToastTwo(variant = null) {
      // this.$bvToast.toast("Successfully Created Account", {
      //   title: `Variant ${variant || "default"}`,
      //   variant: variant,
      //   solid: true,
      // });
    },

    inputSubmit() {
      console.log("submitted");
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


