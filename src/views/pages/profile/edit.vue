<template>
  <div class="main-content">
    <breadcumb :page="'Edit'" :folder="'Profile'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card>
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group class="col-md-6 mb-3" label="Name*" label-for="input-1">
                  <ValidationProvider ref="name" name="Name" rules="required|max:50" v-slot="{ errors }">
                    <b-form-input v-model="form.name" type="text" placeholder="Name"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="Email*" label-for="input-1">
                  <ValidationProvider ref="email" name="Email" rules="required|email|max:50" v-slot="{ errors }">
                    <b-form-input v-model="form.email" type="text" placeholder="Email" readonly></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group label="Phone" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="mobile" name="Phone" rules="min:11|max:13" v-slot="{ errors }">
                    <b-form-input v-model="form.mobile" type="text" placeholder="Phone"></b-form-input>
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
      token: localStorage.getItem("token"),
      form: {
        name: null,
        email: null,
        mobile: null,
        image_profile: null
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.put('profile', {
        name: this.form.name,
        mobile: this.form.password,
        image_profile: this.form.image_profile,
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push({ name: 'profile-index' })
      } else {
        if (data.data) {
          this.$refs.name.applyResult({ errors: data.data.name ?? [] })
          this.$refs.mobile.applyResult({ errors: data.data.mobile ?? [] })
        } else {
          alert(data.message)
        }
      }
    },
    async getDetail() {
      let { data } = await this.axios.get('profile', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.form.name = data.data.name
        this.form.email = data.data.email
        this.form.mobile = data.data.mobile
        this.form.image_profile = data.data.image_profile

      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    }
  }
};
</script>
