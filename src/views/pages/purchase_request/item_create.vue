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
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group  label="Material Number" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="number" name="Material Number" rules="required" v-slot="{ errors }">
                    <b-form-select
                    v-model="form.material_id"
                      :options="getOptionMaterials"
                      id="inline-form-custom-select-pref1"
                      @change="onInitMaterial()"
                    >
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select material number first --</b-form-select-option>
                      </template>
                    </b-form-select>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="Material Description"
                  label-for="input-1"
                >
                  <ValidationProvider ref="description" name="Material Description" rules="required" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.material_description"
                      type="text"
                      placeholder="Material Description"
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="UOM"
                  label-for="input-1"
                >
                  <ValidationProvider ref="uom" name="UOM" rules="required" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.material_uom"
                      type="text"
                      required
                      placeholder="UOM"
                      readonly
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="Unit Price"
                  label-for="input-1"
                >
                  <ValidationProvider ref="price" name="Unit Price" rules="required|numeric|max_value:99999999" v-slot="{ errors }">
                    <b-input-group prepend="IDR">
                      <money
                        v-model="form.material_price"
                        type="text"
                        required
                        placeholder="Unit Price"
                        class="form-control"
                      />
                    </b-input-group>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="QTY"
                  label-for="input-1"
                >
                  <ValidationProvider ref="qty" name="QTY" rules="required|numeric|max_value:99999999" v-slot="{ errors }">
                    <money
                      v-model="form.qty"
                      type="text"
                      required
                      placeholder="QTY"
                      class="form-control"
                    />
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group
                  label="Unit Total"
                  label-for="input-1"
                  class="col-md-6"
                >
                  <ValidationProvider ref="total" name="Unit Total" rules="required" v-slot="{ errors }">
                    <b-input-group prepend="IDR">
                      <money
                        type="text"
                        required
                        placeholder="Unit Total"
                        :value="calculateTotal"
                        readonly
                        class="form-control"
                      />
                    </b-input-group>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group  label="Proposed Supplier" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="supplier" name="Proposed Supplier" rules="required" v-slot="{ errors }">
                    <b-form-select
                      v-model="form.vendor_id"
                        :options="getOptionVendors"
                        id="inline-form-custom-select-pref1"
                      >
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select material number to choose supplier --</b-form-select-option>
                      </template>
                    </b-form-select>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group  label="Delivery Location" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="location" name="Delivery Location" rules="required" v-slot="{ errors }">
                    <b-form-select
                    v-model="form.location_id"
                      :options="getOptionLocations"
                      id="inline-form-custom-select-pref1"
                    >
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select location --</b-form-select-option>
                      </template>
                    </b-form-select>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group  label="Expected Date" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="expected" name="Expected Date" rules="required" v-slot="{ errors }">
                    <b-form-datepicker v-model="form.expected_date" :min="new Date()"></b-form-datepicker>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group  label="File" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="file" name="File" rules="required" v-slot="{ errors }">
                    <b-form-file
                      v-model="form.file"
                      placeholder="Choose a file or drop it here..."
                      drop-placeholder="Drop file here..."
                    />
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
    title: "Purchase Request",
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      materials: [],
      vendors: [],
      locations: [],
      form: {
        material_id: null,
        material_description: null,
        material_uom: null,
        material_price: 0,
        qty: 1,
        vendor_id: null,
        location_id: null,
        expected_date: null,
        file: null,
      }
    }
  },
  mounted() {
    this.getMaterials()
    this.getVendors()
    this.getLocations()
  },
  computed: {
    getOptionMaterials() {
      return this.materials.map(material => {
          return { value: material.id, text: `${material.number} - ${material.name}` }
        })
    },
    getOptionVendors() {
      if (!this.form.material_id) return []

      const materials = this.materials.filter(material => material.id == this.form.material_id)

      const vendors = this.vendors
                      .filter(vendor => vendor.material_category.id == materials[0].material_category.id)

      return vendors.map(vendor => {
          return { value: vendor.id, text: vendor.name }
        })
    },
    getOptionLocations() {
      return this.locations.map(location => {
          return { value: location.id, text: location.name }
        })
    },
    calculateTotal() {
      return (this.form.material_price ?? 0) * this.form.qty
    }
  },
  methods: {
    async getMaterials() {
      let { data } = await this.axios.get('material/all', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.materials = data.data
    },
    async getVendors() {
      let { data } = await this.axios.get('vendor/all', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.vendors = data.data
    },
    async getLocations() {
      let { data } = await this.axios.get('branch/all', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.locations = data.data
    },
    onInitMaterial() {
      const materials = this.materials.filter(material => material.id == this.form.material_id)
      this.form.material_description = materials[0].description
      this.form.material_uom = materials[0].uom
      this.form.material_price = materials[0].price
      this.form.vendor_id = null
    },
    async onSubmit() {
      let formData = new FormData()

      formData.append("purchase_request_id", this.$route.params.id)
      formData.append("material_id", this.form.material_id)
      formData.append("price", this.form.material_price)
      formData.append("description", this.form.material_description)
      formData.append("quantity", this.form.qty)
      formData.append("vendor_id", this.form.vendor_id)
      formData.append("branch_id", this.form.location_id)
      formData.append("expected_at", this.form.expected_date)
      formData.append("file", this.form.file)

      let { data } = await this.axios.post('purchase-request-item', formData, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push({ name: 'purchase-request-detail', params: { id: this.$route.params.id } })
      } else {
        if (data.data) {
          this.$refs.number.applyResult({ errors: data.data.material_id ?? [] })
          this.$refs.price.applyResult({ errors: data.data.price ?? [] })
          this.$refs.description.applyResult({ errors: data.data.description ?? [] })
          this.$refs.qty.applyResult({ errors: data.data.quantity ?? [] })
          this.$refs.location.applyResult({ errors: data.data.branch_id ?? [] })
          this.$refs.supplier.applyResult({ errors: data.data.vendor_id ?? [] })
          this.$refs.expected.applyResult({ errors: data.data.expected_at ?? [] })
          this.$refs.file.applyResult({ errors: data.data.file ?? [] })
        } else {
          alert(data.message)
        }
      }
    },
    async onSubmit() {
      let purchaseRequest = await this.storePurchaseRequest()

      this.storePurchaseRequestItem(purchaseRequest)
    }
  }
}
</script>
