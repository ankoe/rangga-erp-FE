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

              <b-form-group  label="Role" label-for="input-1" class="col-md-6">
                <b-form-select
                  v-model="form.role_id"
                  :options="roles"
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
        name: null,
        email: null,
        mobile: null,
        role_id: null,
      },
      roles: []
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.post('user', {
        name: this.form.name,
        email: this.form.email,
        mobile: this.form.mobile,
        role_id: this.form.role_id,
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.$router.push({ name: 'user-index' })
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    },
    async getRoles() {
      let { data } = await this.axios.get('role', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      // console.log(data)

      // if (data.status == "SUCCESS") {
      //   console.log(data)
        this.roles = data.data.map(role => {
          return { value: role.id, text: `${role.group} - ${role.display_name}` }
        })
      // } else {
      //   // ada validation form

      //   // jika tidak ada validation form, error global
      // }
    }
  }
};
</script>
