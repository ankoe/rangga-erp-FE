<template>
  <div class="main-content">
    <breadcumb :page="'Blank'" :folder="'Pages'" />


    <b-row>
      <b-col md="12 mb-30">
        <b-card>
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row v-for="(form, index) in forms" :key="index" class="mb-5">
                <div class="col-md-12 d-flex justify-content-between">
                  <h4 class="d-inline-block">Item {{ index + 1 }}</h4>
                  <button v-if="forms.length > 1" class="btn btn-danger btn-sm" type="button"
                    @click="deleteForm(index, form)">
                    Hapus
                  </button>
                </div>
                <b-form-group label="Material Number" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="number" name="Material Number" rules="required" v-slot="{ errors }">
                    <b-form-select v-model="form.material_id" :options="getOptionMaterials"
                      id="inline-form-custom-select-pref1" @change="onInitMaterial(index)">
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select material number first
                          --</b-form-select-option>
                      </template>
                    </b-form-select>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="Material Description" label-for="input-1">
                  <ValidationProvider ref="description" name="Material Description" rules="required" v-slot="{ errors }">
                    <b-form-input v-model="form.material_description" type="text"
                      placeholder="Material Description"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="UOM" label-for="input-1">
                  <ValidationProvider ref="uom" name="UOM" rules="required" v-slot="{ errors }">
                    <b-form-input v-model="form.material_uom" type="text" required placeholder="UOM"
                      readonly></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="Unit Price" label-for="input-1">
                  <ValidationProvider ref="price" name="Unit Price" rules="required|numeric|max_value:99999999"
                    v-slot="{ errors }">
                    <b-input-group prepend="IDR">
                      <money v-model="form.material_price" type="text" required placeholder="Unit Price"
                        class="form-control" />
                    </b-input-group>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="QTY" label-for="input-1">
                  <ValidationProvider ref="qty" name="QTY" rules="required|numeric|max_value:99999999"
                    v-slot="{ errors }">
                    <money v-model="form.qty" type="text" required placeholder="QTY" class="form-control" />
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group label="Unit Total" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="total" name="Unit Total" rules="required" v-slot="{ errors }">
                    <b-input-group prepend="IDR">
                      <money type="text" required placeholder="Unit Total" :value="calculateTotal(index)" readonly
                        class="form-control" />
                    </b-input-group>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group label="Proposed Supplier" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="supplier" name="Proposed Supplier" rules="required" v-slot="{ errors }">
                    <b-form-select v-model="form.vendor_id" :options="getOptionVendors(index)"
                      id="inline-form-custom-select-pref1">
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select material number to choose supplier
                          --</b-form-select-option>
                      </template>
                    </b-form-select>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <b-button variant="link" class="mt-2 p-0" @click="$bvModal.show('modal-add-vendor')">Add
                    supplier</b-button>
                </b-form-group>

                <b-form-group label="Delivery Location" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="location" name="Delivery Location" rules="required" v-slot="{ errors }">
                    <b-form-select v-model="form.location_id" :options="getOptionLocations"
                      id="inline-form-custom-select-pref1">
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select location --</b-form-select-option>
                      </template>
                    </b-form-select>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <b-button variant="link" class="mt-2 p-0" @click="$bvModal.show('modal-add-location')">Add
                    location</b-button>
                </b-form-group>

                <b-form-group label="Expected Date" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="expected" name="Expected Date" rules="required" v-slot="{ errors }">
                    <b-form-datepicker v-model="form.expected_date" :min="new Date()"></b-form-datepicker>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group label="File" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="file" name="File" rules="required" v-slot="{ errors }">
                    <b-form-file v-model="form.file" placeholder="Choose a file or drop it here..."
                      drop-placeholder="Drop file here..." />
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
              </b-row>

              <b-row class="mt-5">
                <b-col offset="6" md="6" class="d-flex justify-content-end">
                  <button @click="addForm" type="button" class="btn btn-info btn-sm">Tambah</button>
                  <b-button class="ml-1" type="submit" variant="primary">Submit</b-button>
                </b-col>
              </b-row>
            </b-form>
          </ValidationObserver>
        </b-card>
      </b-col>
    </b-row>

    <b-modal id="modal-add-vendor" centered title="Add Supplier" ref="supplierModal" @show="supplierModalReset"
      @hidden="supplierModalReset" @ok="supplierModalOk">
      <form ref="form" @submit.stop.prevent="supplierModalSubmit">

      </form>
    </b-modal>

    <b-modal id="modal-add-location" centered title="Add Location" ref="locationModal" @show="locationModalRest"
      @hidden="locationModalRest" @ok="locationModalOk">
      <form ref="form" @submit.stop.prevent="locationModalSubmit">

      </form>
    </b-modal>

  </div>
</template>
<script>
export default {
  metaInfo: {
    title: "Purchase Request",
  },
  data() {
    return {
      materials: [],
      vendors: [],
      locations: [],
      forms: [],
      modalAddVendor: {
        name: null,
        email: null,
        material_category_id: null
      },
      modalAddLocation: {
        name: null,
        address: null,
        email: null,
        phone: null
      },
    }
  },
  mounted() {
    this.getMaterials()
    this.getVendors()
    this.getLocations()
    this.addForm()
  },
  computed: {
    getOptionMaterials() {
      return this.materials.map(material => {
        return { value: material.id, text: `${material.number} - ${material.name}` }
      })
    },
    getOptionLocations() {
      return this.locations.map(location => {
        return { value: location.id, text: location.name }
      })
    },
  },
  methods: {
    getOptionVendors(index) {
      if (!this.forms[index].material_id) return []

      const materials = this.materials.filter(material => material.id == this.forms[index].material_id)

      const vendors = this.vendors
        .filter(vendor => vendor.material_category.id == materials[0].material_category.id)

      return vendors.map(vendor => {
        return { value: vendor.id, text: vendor.name }
      })
    },
    calculateTotal(index) {
      return (this.forms[index].material_price ?? 0) * this.forms[index].qty
    },
    async getMaterials() {
      let { data } = await this.axios.get('material/all')

      this.materials = data.data
    },
    async getVendors() {
      let { data } = await this.axios.get('vendor/all')

      this.vendors = data.data
    },
    async getLocations() {
      let { data } = await this.axios.get('branch/all')

      this.locations = data.data
    },
    onInitMaterial(index) {
      const materials = this.materials.filter(material => material.id == this.forms[index].material_id)
      this.forms[index].material_description = materials[0].description
      this.forms[index].material_uom = materials[0].uom
      this.forms[index].material_price = materials[0].price
      this.forms[index].vendor_id = null
    },
    addForm() {
      this.forms.push({
        material_id: null,
        material_description: null,
        material_uom: null,
        material_price: 0,
        qty: 1,
        vendor_id: null,
        location_id: null,
        expected_date: null,
        file: null,
      })
    },
    deleteForm(index, form) {
      if (confirm("Apakah anda yakin?")) {
        const idx = this.forms.indexOf(form)
        if (idx > -1) this.forms.splice(idx, 1)
      }
    },
    async storePurchaseRequest() {
      let { data } = await this.axios.post('purchase-request')

      return (data.status == "SUCCESS") ? data.data.id : false
    },
    async storePurchaseRequestItem(purchaseRequestId, form) {
      let formData = new FormData()

      formData.append("purchase_request_id", purchaseRequestId)
      formData.append("material_id", form.material_id)
      formData.append("price", form.material_price)
      formData.append("description", form.material_description)
      formData.append("quantity", form.qty)
      formData.append("vendor_id", form.vendor_id)
      formData.append("branch_id", form.location_id)
      formData.append("expected_at", form.expected_date)
      formData.append("file", form.file)

      await this.axios.post('purchase-request-item', formData)
    },
    async onSubmit() {
      let purchaseRequestId = await this.storePurchaseRequest()

      if (purchaseRequestId) {
        await this.forms.forEach(form => {
          this.storePurchaseRequestItem(purchaseRequestId, form)
        })

        this.$router.push({ name: 'purchase-request-index' })
      }
    },
    supplierModalReset() {
      // this.modal.role_id = null
      // this.modal.nameState = null
    },
    locationModalReset() {
      // this.modal.role_id = null
      // this.modal.nameState = null
    },
    supplierModalOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.supplierModalSubmit()
    },
    locationModalOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.locationModalSubmit()
    },
    supplierModalSubmit() {
      // Exit when the form isn't valid
      // if (!this.checkFormValidity()) {
      //   return
      // }
      // Push the name to submitted names
      // const role = this.roles.find(role => role.id == this.modal.role_id)
      // if (this.modal.group == 'office')
      //   this.offices.push({ id: null, order: null, role })
      // else
      //   this.procurements.push({ id: null, order: null, role })
      this.getVendors()
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-add-vendor')
      })
    },
    locationModalSubmit() {
      // Exit when the form isn't valid
      // if (!this.checkFormValidity()) {
      //   return
      // }
      // Push the name to submitted names
      // const role = this.roles.find(role => role.id == this.modal.role_id)
      // if (this.modal.group == 'office')
      //   this.offices.push({ id: null, order: null, role })
      // else
      //   this.procurements.push({ id: null, order: null, role })
      this.getLocations()
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-add-location')
      })
    },
  }
}
</script>
