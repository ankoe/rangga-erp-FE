<template>
  <div class="main-content">
    <breadcumb :page="'Blank'" :folder="'Pages'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" class="mt-auto">
            <h5>Number : {{ code }}</h5>

          </b-col>
        </b-row>
      </b-card-header>

      <b-table striped hover :items="items" :fields="fields" responsive="sm" :busy="loading" show-empty>
        <template #empty>
          Data not found or empty
        </template>
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>

        <template #cell(price)="{ value }">
          {{ $n(exchange(value), 'currency', getExchangeLocale) }}
        </template>

        <template #cell(expected_at)="{ value }">
          {{ value | luxon({ output: { format: "dd-MM-yyyy" } }) }}
        </template>

        <template #cell(file)="{ value }">
          <a :href="value" target="_blank">File</a>
        </template>

        <template #cell(total)="{ value }">
          {{ $n(exchange(value), 'currency', getExchangeLocale) }}
        </template>

        <template #cell(incoterms)="{ item }">
          <b-form-select v-if="status && status.title == 'waiting rfq response'" size="sm" v-model="item.incoterms"
            :options="incoterms"></b-form-select>
          <span v-else>{{ item.incoterms }}</span>
        </template>

        <template #cell(action)="{ item }">
          <vue-tags-input v-if="status && status.title == 'waiting rfq response'" v-model="item.tag" :tags="item.tags"
            :add-only-from-autocomplete="true" placeholder="add vendor" :autocomplete-items="filteredVendors(item)"
            @tags-changed="newTags => item.tags = newTags" />
          <b-button v-else size="sm" @click="item._showDetails = !item._showDetails">
            {{ item._showDetails ? 'Hide' : 'Show' }} Details
          </b-button>
        </template>

        <template #row-details="row">
          <b-card>
            <b-form-group v-slot="{ ariaDescribedby }">

              <b-row class="mb-4 pb-2 border-bottom">
                <b-col class=""><b>Vendor Name</b></b-col>
                <b-col class=""><b>Vendor Price</b></b-col>
                <b-col class=""><b>Vendor Stock</b></b-col>
                <b-col class=""><b>Incoterms</b></b-col>
                <b-col class=""><b>Aggrement</b></b-col>
                <b-col class=""><b>Choice</b></b-col>
              </b-row>

              <b-row v-for="(requestQuotation, index) in row.item.request_quotation" :key="index" class="mb-2">
                <b-col class=""><b>{{ requestQuotation.vendor.name }}</b></b-col>
                <b-col>{{ requestQuotation.vendor_price ? requestQuotation.vendor_price : '-' }}</b-col>
                <b-col>{{ requestQuotation.vendor_stock ? requestQuotation.vendor_stock : '-' }}</b-col>
                <b-col>{{ requestQuotation.vendor_incoterms ? requestQuotation.vendor_incoterms : '-' }}</b-col>
                <b-col>
                  {{
                    requestQuotation.vendor_is_agree != null ? (requestQuotation.vendor_is_agree ? 'Accept PO' : 'Refuse PO'
                  ) : '-'
                  }}
                </b-col>
                <b-col>
                  <b-form-radio v-if="status && status.title == 'waiting rfq approval'"
                    v-model="row.item.request_quotation_selected" :aria-describedby="ariaDescribedby"
                    :name="'request-quotation-' + requestQuotation.id" :value="requestQuotation.id">Pilih</b-form-radio>
                  <template v-else>
                    {{ requestQuotation.is_selected ? 'selected' : '-' }}
                  </template>
                </b-col>
              </b-row>
            </b-form-group>
          </b-card>
        </template>
      </b-table>

      <b-card-footer>
        <b-row class="mt-4">
          <b-col md="8">
            <h4>Status: {{ status ? status.description : '' }}</h4>
          </b-col>
          <b-col class="text-right">
            <button v-if="status && status.title == 'waiting rfq response'" type="button"
              class="btn btn-success btn-sm mb-3" @click="onSubmitVendor()">
              Submit Vendor
            </button>
            <button v-if="status && status.title == 'waiting rfq approval'" type=" button"
              class="btn btn-success btn-sm mb-3" @click="onSubmitApproval()">
              Send Approval
            </button>
            <template v-if="status && status.title == 'waiting po confirmation'">
              <div v-show="permissions.includes('procurement rfq approval')">
                <button type=" button" class="btn btn-danger btn-sm mb-3" @click="onReject()">
                  Reject
                </button>
                <button type=" button" class="btn btn-success btn-sm mb-3 ml-2" @click="onApprove()">
                  Approve
                </button>
              </div>
            </template>
          </b-col>
        </b-row>
      </b-card-footer>
    </b-card>

  </div>
</template>
<script>
import { mapGetters } from "vuex"

export default {
  metaInfo: {
    title: "Purchase Request",
  },
  data() {
    return {
      loading: false,
      code: null,
      status: null,
      permissions: [],
      incoterms: [
        'Ex-Works or Ex-Warehouse',
        'Free to Carrier',
        'Free Alongside Ship',
        'Free On Board',
        'Cost and Freight',
        'Cost, Insurance and Freight',
        'Carriage Paid To',
        'Carriage And Insurance Paid To',
        'Delivered At Place',
        'Delivered At Place Unloaded',
        'Delivered Duty Paid'
      ],
      items: [],
      fields: [
        {
          key: 'material.number',
          label: 'Material Number',
        },
        {
          key: 'material.name',
          label: 'Material Name',
        },
        {
          key: 'material.description',
          label: 'Material Desc',
        },
        {
          key: 'material.uom',
          label: 'UOM',
        },
        {
          key: 'quantity',
          label: 'QTY',
        },
        {
          key: 'vendor.name',
          label: 'Proposed Supplier',
        },
        {
          key: 'price',
          label: 'Unit Price',
        },
        {
          key: 'branch.name',
          label: 'Delivery Location',
        },
        {
          key: 'expected_at',
          label: 'Expected Date',
        },
        {
          key: 'file',
          label: 'File',
        },
        {
          key: 'total',
          label: 'Total Value',
        },
        {
          key: 'incoterms',
          label: 'Incoterms',
        },
        {
          key: 'action',
          label: 'Vendor',
        },
      ],
      vendors: [],
    }
  },
  mounted() {
    this.getItems()
    this.getVendors()
    this.permissions = JSON.parse(localStorage.getItem("permissions"))
  },
  computed: {
    ...mapGetters(["getRate", "getExchangeLocale"]),
  },
  methods: {
    exchange(value) {
      return value * this.getRate
    },
    async getItems() {
      this.loading = true
      let { data } = await this.axios.get('procurement/request-for-quotation/' + this.$route.params.id)

      this.code = data.data.code
      this.status = data.data.status

      this.items = data.data.items.map(item => {
        item.tag = ''
        item.tags = []
        if (item.incoterms == null) item.incoterms = 'Free to Carrier'
        item._showDetails = false
        item.request_quotation_selected = null
        return item
      })

      this.loading = false
    },
    async getVendors() {
      let { data } = await this.axios.get('vendor/all')

      this.vendors = data.data
    },
    filteredVendors(item) {
      return this.vendors.filter(vendor => {
        return vendor.material_category.id == item.material.material_category.id
      }).filter(vendor => {
        return vendor.name.toLowerCase().indexOf(item.tag.toLowerCase()) !== -1
      }).map(vendor => {
        return { text: vendor.name }
      })
    },
    async onSubmitVendor() {
      let readySubmit = true
      await this.items.forEach(item => {

        if (item.tags.length == 0) readySubmit = false
      })

      if (readySubmit) {
        let items = this.items.map(item => {
          return {
            id: item.id,
            incoterms: item.incoterms,
            vendors: item.tags.map(tag => {
              return this.vendors.find(vendor => vendor.name.toLowerCase() === tag.text.toLowerCase()).id
            })
          }
        })

        let { data } = await this.axios.post(`procurement/request-for-quotation/${this.$route.params.id}/propose-vendor`, {
          items: items
        })

        if (data.status == "SUCCESS") {
          alert(data.message)
          this.getItems()
        } else {
          alert(data.message)
        }

      } else {
        alert('All items must have vendor!')
      }
    },
    async onSubmitApproval() {
      let readySubmit = true
      await this.items.forEach(item => {

        if (item.request_quotation_selected == null) readySubmit = false
      })

      if (readySubmit) {
        let items = this.items.map(item => {
          return {
            id: item.id,
            selected_id: item.request_quotation_selected
          }
        })

        let { data } = await this.axios.post(`procurement/request-for-quotation/${this.$route.params.id}/propose-approval`, {
          items: items
        })

        if (data.status == "SUCCESS") {
          alert(data.message)
          this.getItems()
        } else {
          alert(data.message)
        }

      } else {
        alert('All items must selected winning vendor!')
      }
    },
    async onApprove() {

      let { data } = await this.axios.get(`procurement/request-for-quotation/${this.$route.params.id}/set-approve`)

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.getItems()
      } else {
        alert(data.message)
      }
    },
    async onReject() {

      let { data } = await this.axios.get(`procurement/request-for-quotation/${this.$route.params.id}/set-reject`)

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.getItems()
      } else {
        alert(data.message)
      }
    }
  }
}
</script>
