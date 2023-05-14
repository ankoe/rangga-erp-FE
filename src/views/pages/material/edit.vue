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
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group label="Material Category*" label-for="input-1" class="col-md-6 mb-3">
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
                <b-form-group
                  class="col-md-6 mb-3"
                  label="Name*"
                  label-for="input-1"
                >
                  <ValidationProvider ref="name" name="Name" rules="required|max:150" v-slot="{ errors }">
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
                  label="Number*"
                  label-for="input-1"
                >
                  <ValidationProvider ref="number" name="Number" rules="required|max:30" v-slot="{ errors }">
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
                  label="UOM*"
                  label-for="input-1"
                >
                  <ValidationProvider ref="uom" name="UOM" rules="required|max:20" v-slot="{ errors }">
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
                  label="Price*"
                  label-for="input-1"
                >
                  <ValidationProvider ref="price" name="Price" rules="required|numeric|max_value:99999999" v-slot="{ errors }">
                    <b-input-group prepend="IDR">
                      <money
                        v-model="form.price"
                        type="text"
                        placeholder="Price"
                        class="form-control"
                      />
                    </b-input-group>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="Stock*"
                  label-for="input-1"
                >
                  <ValidationProvider ref="stock" name="Stock" rules="required|numeric|max_value:99999999" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.stock"
                      type="text"
                      placeholder="Stock"
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group
                  label="Description*"
                  label-for="input-1"
                  class="col-md-6"
                >
                  <ValidationProvider ref="description" name="Description" rules="required" v-slot="{ errors }">
                    <b-form-textarea
                      v-model="form.description"
                      rows="5"
                      no-resize
                      placeholder="Description"
                    ></b-form-textarea>
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
    title: "Material",
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      form: {
        material_category_id: null,
        name: null,
        number: null,
        description: null,
        uom: null,
        price: null,
        stock: null,
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
        stock: this.form.stock,
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push({ name: 'material-index' })
      } else {
        if (data.data) {
          this.$refs.category.applyResult({ errors: data.data.material_category_id ?? [] })
          this.$refs.name.applyResult({ errors: data.data.name ?? [] })
          this.$refs.number.applyResult({ errors: data.data.number ?? [] })
          this.$refs.description.applyResult({ errors: data.data.description ?? [] })
          this.$refs.uom.applyResult({ errors: data.data.uom ?? [] })
          this.$refs.price.applyResult({ errors: data.data.price ?? [] })
          this.$refs.stock.applyResult({ errors: data.data.stock ?? [] })
        } else {
          alert(data.message)
        }
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
        this.form.stock = data.data.stock
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
