<template>
  <div class="main-content">
    <breadcumb :page="'Change Password'" :folder="'Profile'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card>
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group class="col-md-6 mb-3" label="Current Password*" label-for="input-1">
                  <ValidationProvider ref="current" name="Current Password" rules="required" v-slot="{ errors }">
                    <b-form-input v-model="form.password_current" type="password"
                      placeholder="Current Password"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="New Password*" label-for="input-1">
                  <ValidationProvider ref="password" name="New Password" rules="required" vid="password"
                    v-slot="{ errors }">
                    <b-form-input v-model="form.password" type="password" placeholder="New Password"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group label="Repeat Password*" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="repassword" name="Repeat Password" rules="required|confirmed:password"
                    v-slot="{ errors }">
                    <b-form-input v-model="form.repassword" type="password" placeholder="Repeat Password"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-col md="12" class="d-flex justify-content-end">
                  <b-button class="mt-3" type="submit" variant="primary">Submit</b-button>
                </b-col>
              </b-row>
            </b-form>
          </ValidationObserver>
        </b-card>
      </b-col>
    </b-row>


  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        password_current: null,
        password: null,
        repassword: null
      }
    }
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.put('profile/password', {
        password_current: this.form.password_current,
        password: this.form.password,
        password_confirmation: this.form.repassword,
      })

      if (data.status == "SUCCESS") {
        alert(data.message)

        this.$router.push({ name: 'profile-index' })
      } else {
        if (data.data) {
          this.$refs.current.applyResult({ errors: data.data.password_current ?? [] })
          this.$refs.password.applyResult({ errors: data.data.password ?? [] })
          this.$refs.repassword.applyResult({ errors: data.data.password_confirmation ?? [] })
        } else {
          alert(data.message)
        }
      }
    }
  }
};
</script>
