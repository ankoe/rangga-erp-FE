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
    <breadcumb :page="'Blank'" :folder="'Pages'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card title="Form Inputs">
          <b-form @submit.prevent="onSubmit">
            <b-row>
              <b-form-group
                class="col-md-6 mb-3"

                label="Name"
                label-for="input-1"
              >
                <b-form-input

                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Name"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                class="col-md-6 mb-3"

                label="Address"
                label-for="input-1"
              >
                <b-form-input

                  v-model="form.address"
                  type="text"
                  required
                  placeholder="Address"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                class="col-md-6 mb-3"

                label="Email"
                label-for="input-1"
              >
                <b-form-input

                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Email"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                class="col-md-6 mb-3"

                label="Phone"
                label-for="input-1"
              >
                <b-form-input

                  v-model="form.mobile"
                  type="text"
                  required
                  placeholder="Phone"
                ></b-form-input>
              </b-form-group>

              <b-col md="12">
                <b-button class="mt-3" type="submit" variant="primary">Submit</b-button>
              </b-col>
            </b-row>
          </b-form>
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
  methods: {
    async onSubmit() {
      let { data } = await this.axios.post('branch', {
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
  }
};
</script>
