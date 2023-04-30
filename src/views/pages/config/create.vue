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
    <breadcumb :page="'Create'" :folder="'Pages'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card>
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

              <b-form-group  label="Group" label-for="input-1" class="col-md-6">
                <b-form-select
                v-model="form.group"
                  :options="groups"
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
        group: null
      },
      groups: ['office', 'procurement']
    }
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.post('role', {
        name: this.form.name,
        group: this.form.group
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.$router.push({ name: 'role-index' })
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    }
  }
};
</script>
