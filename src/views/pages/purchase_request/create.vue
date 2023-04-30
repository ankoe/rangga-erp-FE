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
          <b-form>
            <b-row>
              <b-form-group
                class="col-md-6 mb-3"

                label="First Name"
                label-for="input-1"
              >
                <b-form-input

                  v-model="form.fName"
                  type="text"
                  required
                  placeholder="First Name"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                class="col-md-6 mb-3"

                label="Last Name"
                label-for="input-1"
              >
                <b-form-input

                  v-model="form.lName"
                  type="text"
                  required
                  placeholder="Last Name"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                class="col-md-6 mb-3"

                label="Email address:"
                label-for="input-1"
                description="We'll never share your email with anyone else."
              >
                <b-form-input

                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Enter email"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                class="col-md-6 mb-3"

                label="Phone Number:"
                label-for="input-1"
              >
                <b-form-input

                  v-model="form.phone"
                  type="text"
                  required
                  placeholder="put your phone number"
                ></b-form-input>
              </b-form-group>

              <b-form-group

                label="Credit Card"
                label-for="input-1"
                class="col-md-6"
              >
                <b-form-input

                  v-model="form.credit"
                  type="email"
                  required
                  placeholder="Enter Credit Card Number"
                ></b-form-input>
              </b-form-group>

              <b-form-group  label="Date" label-for="input-1" class="col-md-6">
                <!-- <v-date-picker
                                v-model="date"
                />-->
                <b-form-input v-model="date" class="input" type="date"></b-form-input>
              </b-form-group>

              <b-form-group  label="Select" label-for="input-1" class="col-md-6">
                <b-form-select
                v-model="selected1"
                  :options="options1"
                  id="inline-form-custom-select-pref1"
                >

                </b-form-select>
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
        status: null,
        items: []
      }
    }
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.post('purchase-request', {
        email: this.form.email,
        password: this.form.password
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.$router.push({ name: 'purchase-request-index' })
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    }
  }
};
</script>
