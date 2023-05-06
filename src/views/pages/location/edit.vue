<style  scoped>
.app-footer {
    margin-top: 2rem;
    background: #eee;
    padding: 1.25rem;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: none;
}
</style>
<template>
  <div class="main-content">
    <breadcumb :page="'Edit'" :folder="'Location'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card title="Form Inputs">
          <ValidationObserver v-slot="{ handleSubmit }">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="Name"
                  label-for="input-1"
                >
                  <ValidationProvider name="Name" rules="required" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.name"
                      type="text"
                      placeholder="Name"
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Address"
                  label-for="input-1"
                >
                  <ValidationProvider name="Address" rules="required" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.address"
                      type="text"
                      placeholder="Address"
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Email"
                  label-for="input-1"
                >
                  <ValidationProvider name="Email" rules="required|email" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.email"
                      type="email"
                      placeholder="Email"
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group
                  class="col-md-6 mb-3"
                  label="Phone"
                  label-for="input-1"
                >
                  <ValidationProvider name="Phone" rules="required" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.mobile"
                      type="text"
                      placeholder="Phone"
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-col md="12">
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
        address: null,
        email: null,
        mobile: null,
      },
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.put('branch/' + this.$route.params.id, {
        name: this.form.name,
        address: this.form.address,
        email: this.form.email,
        mobile: this.form.mobile,
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.$router.push({ name: 'location-index' })
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    },
    async getDetail() {
      let { data } = await this.axios.get('branch/' + this.$route.params.id, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.form.name = data.data.name
        this.form.address = data.data.address
        this.form.email = data.data.email
        this.form.mobile = data.data.mobile
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    }
  }
};
</script>
