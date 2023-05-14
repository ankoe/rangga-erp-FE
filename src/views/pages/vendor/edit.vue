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
    <breadcumb :page="'Edit'" :folder="'Vendor'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card>
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="Name*"
                  label-for="input-1"
                >
                  <ValidationProvider ref="name" name="Name" rules="required|max:50" v-slot="{ errors }">
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
                  label="Email*"
                  label-for="input-1"
                >
                  <ValidationProvider ref="email" name="Email" rules="required|email|max:50" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.email"
                      type="text"
                      placeholder="Email"
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group  label="Material Category*" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="category" name="Material Category" rules="required" v-slot="{ errors }">
                    <b-form-select
                      v-model="form.material_category_id"
                      :options="materialCategories"
                      id="inline-form-custom-select-pref1"
                    >
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select material category --</b-form-select-option>
                      </template>
                    </b-form-select>
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
  metaInfo: {
    title: "Vendor",
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      form: {
        name: null,
        email: null,
        material_category_id: null,
      },
      materialCategories: []
    }
  },
  mounted() {
    this.getMaterialCategories()
    this.getDetail()
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.put('vendor/' + this.$route.params.id, {
        name: this.form.name,
        email: this.form.email,
        material_category_id: this.form.material_category_id
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push({ name: 'vendor-index' })
      } else {
        if (data.data) {
          this.$refs.name.applyResult({ errors: data.data.name ?? [] })
          this.$refs.email.applyResult({ errors: data.data.email ?? [] })
          this.$refs.category.applyResult({ errors: data.data.material_category_id ?? [] })
        } else {
          alert(data.message)
        }
      }
    },
    async getDetail() {
      let { data } = await this.axios.get('vendor/' + this.$route.params.id, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.form.name = data.data.name
        this.form.email = data.data.email
        this.form.material_category_id = data.data.material_category.id
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    },
    async getMaterialCategories() {
      let { data } = await this.axios.get('material-category', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.materialCategories = data.data.map(materialCategory => {
        return { value: materialCategory.id, text: materialCategory.name }
      })
    }
  }
};
</script>
