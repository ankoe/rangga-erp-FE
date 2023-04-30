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
                  placeholder="Category Name"
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
import axios from 'axios'

export default {
  data() {
    return {
      token: localStorage.getItem("token"),
      form: {
        name: null
      }
    }
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.post('material-category', {
        name: this.form.name
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.$router.push({ name: 'material-category-index' })
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    }
  }
};
</script>
