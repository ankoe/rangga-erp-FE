<template>
  <div class="main-content">
    <breadcumb :page="'Process'" :folder="'Material'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card>
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group label="Material Category*" label-for="input-1" class="col-md-6 mb-3">
                  <ValidationProvider ref="category" name="Material Category" rules="required" v-slot="{ errors }">
                    <b-form-select v-model="form.material_category_id" :options="materialCategories"
                      id="inline-form-custom-select-pref1">
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select material category
                          --</b-form-select-option>
                      </template>
                    </b-form-select>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="Name*" label-for="input-1">
                  <ValidationProvider ref="name" name="Name" rules="required|max:150" v-slot="{ errors }">
                    <b-form-input v-model="form.name" type="text" placeholder="Name"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="Number*" label-for="input-1">
                  <ValidationProvider ref="number" name="Number" rules="required|max:30" v-slot="{ errors }">
                    <b-form-input v-model="form.number" type="text" placeholder="Number"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="UOM*" label-for="input-1">
                  <ValidationProvider ref="unit" name="UOM" rules="required|max:20" v-slot="{ errors }">
                    <b-form-select v-model="form.unit_id" :options="units" id="inline-form-custom-select-pref2">
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select UOM
                          --</b-form-select-option>
                      </template>
                    </b-form-select>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="Price*" label-for="input-1">
                  <ValidationProvider ref="price" name="Price" rules="required|numeric|max_value:99999999"
                    v-slot="{ errors }">
                    <b-input-group prepend="IDR">
                      <money v-model="form.price" type="text" placeholder="Price" class="form-control" />
                    </b-input-group>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="Stock*" label-for="input-1">
                  <ValidationProvider ref="stock" name="Stock" rules="required|numeric|max_value:99999999"
                    v-slot="{ errors }">
                    <money v-model="form.stock" type="text" placeholder="Stock" class="form-control" />
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group label="Description*" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="description" name="Description" rules="required" v-slot="{ errors }">
                    <b-form-textarea v-model="form.description" rows="5" no-resize
                      placeholder="Description"></b-form-textarea>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group label="Attachment" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="attachment" name="Attachment" rules="" v-slot="{ errors }">
                    <b-form-file v-model="form.attachment"
                      accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .xls, .xlsx"></b-form-file>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <p>current: <a :href="attachment" target="_blank">Preview</a></p>
                </b-form-group>

                <b-col md="12" class="d-flex justify-content-end">
                  <b-button variant="danger" class="mt-3 mr-2" @click="onReject">Reject</b-button>
                  <b-button class="mt-3" type="submit" variant="success">Process</b-button>
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
      form: {
        material_category_id: null,
        name: null,
        number: null,
        description: null,
        unit_id: null,
        price: 0,
        stock: 0,
        attachment: null
      },
      materialCategories: [],
      units: [],
      attachment: null
    }
  },
  mounted() {
    this.getMaterialCategories()
    this.getUnits()
    this.getDetail()
  },
  methods: {
    async onSubmit() {
      const formData = new FormData()
      formData.append('material_category_id', this.form.material_category_id)
      formData.append('name', this.form.name)
      formData.append('number', this.form.number)
      formData.append('description', this.form.description)
      formData.append('unit_id', this.form.unit_id)
      formData.append('price', this.form.price)
      formData.append('stock', this.form.stock)
      formData.append('attachment', this.form.attachment ? this.form.attachment : '')

      let { data } = await this.axios.post('material/request/' + this.$route.params.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push({ name: 'material-material-request-index' })
      } else {
        if (data.data) {
          this.$refs.category.applyResult({ errors: data.data.material_category_id ?? [] })
          this.$refs.name.applyResult({ errors: data.data.name ?? [] })
          this.$refs.number.applyResult({ errors: data.data.number ?? [] })
          this.$refs.description.applyResult({ errors: data.data.description ?? [] })
          this.$refs.unit.applyResult({ errors: data.data.unit_id ?? [] })
          this.$refs.price.applyResult({ errors: data.data.price ?? [] })
          this.$refs.stock.applyResult({ errors: data.data.stock ?? [] })
          this.$refs.attachment.applyResult({ errors: data.data.attachment ?? [] })
        } else {
          alert(data.message)
        }
      }
    },
    async getDetail() {
      let { data } = await this.axios.get('material/request/' + this.$route.params.id)

      if (data.status == "SUCCESS") {
        this.form.material_category_id = data.data.material_category ? data.data.material_category.id : null
        this.form.name = data.data.name
        this.form.number = data.data.number
        this.form.description = data.data.description
        this.form.unit_id = data.data.unit.id
        this.form.price = data.data.price
        this.form.stock = data.data.stock
        this.attachment = data.data.attachment
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    },
    async getMaterialCategories() {
      let { data } = await this.axios.get('material-category')

      this.materialCategories = data.data.map(materialCategory => {
        return { value: materialCategory.id, text: materialCategory.name }
      })
    },
    async getUnits() {
      let { data } = await this.axios.get('unit')

      this.units = data.data.map(unit => {
        return { value: unit.id, text: unit.name }
      })
    },
    async onReject() {
      const result = confirm("Want to reject?")
      if (result) {
        await this.axios.delete('material/request/' + this.$route.params.id)
        this.$router.push({ name: 'material-material-request-index' })
      }
    },
  }
};
</script>
