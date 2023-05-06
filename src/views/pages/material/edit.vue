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
    <breadcumb :page="'Edit'" :folder="'Material'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card>
          <ValidationObserver v-slot="{ handleSubmit }">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group label="Material Category" label-for="input-1" class="col-md-6 mb-3">
                  <ValidationProvider name="Material Category" rules="required" v-slot="{ errors }">
                    <b-form-select
                      v-model="form.material_category_id"
                      :options="materialCategories"
                      id="inline-form-custom-select-pref1"
                    >
                    </b-form-select>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
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
                  label="Number"
                  label-for="input-1"
                >
                  <ValidationProvider name="Number" rules="required" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.number"
                      type="text"
                      placeholder="Number"
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="UOM"
                  label-for="input-1"
                >
                  <ValidationProvider name="UOM" rules="required" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.uom"
                      type="text"
                      placeholder="UOM"
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="Price"
                  label-for="input-1"
                >
                  <ValidationProvider name="Price" rules="required" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.price"
                      type="text"
                      placeholder="Price"
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group
                  label="Description"
                  label-for="input-1"
                  class="col-md-6"
                >
                  <ValidationProvider name="Description" rules="required" v-slot="{ errors }">
                    <b-form-textarea
                      v-model="form.description"
                      rows="5"
                      no-resize
                      placeholder="Description"
                    ></b-form-textarea>
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
        material_category_id: null,
        name: null,
        number: null,
        description: null,
        uom: null,
        price: null
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
      let { data } = await this.axios.put('material/' + this.$route.params.id, {
        material_category_id: this.form.material_category_id,
        name: this.form.name,
        number: this.form.number,
        description: this.form.description,
        uom: this.form.uom,
        price: this.form.price,
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.$router.push({ name: 'material-index' })
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    },
    async getDetail() {
      let { data } = await this.axios.get('material/' + this.$route.params.id, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.form.material_category_id = data.data.material_category.id
        this.form.name = data.data.name
        this.form.number = data.data.number
        this.form.description = data.data.description
        this.form.uom = data.data.uom
        this.form.price = data.data.price
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
