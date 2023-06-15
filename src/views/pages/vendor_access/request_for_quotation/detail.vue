<template>
  <div class="main-content">
    <breadcumb :page="code" :folder="'Request for Quotation'" />

    <b-card class="wrapper">

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

        <template #cell(expected_at)="{ value }">
          {{ value | luxon({ output: { format: "dd-MM-yyyy" } }) }}
        </template>

        <template #cell(file)="{ value }">
          <a :href="value" target="_blank">File</a>
        </template>

        <template #cell(vendor_price)="{ item }">
          <b-form-input size="sm" v-model="item.vendor_price" />
        </template>

        <template #cell(vendor_stock)="{ item }">
          <b-form-input size="sm" v-model="item.vendor_stock" />
        </template>

        <template #cell(vendor_incoterms)="{ item }">
          <b-form-select size="sm" v-model="item.vendor_incoterms" :options="incoterms"></b-form-select>
        </template>
      </b-table>

      <b-card-footer>
        <b-row class="mt-4">
          <b-col class="text-right" offset-md="8">
            <button type="button" class="btn btn-success btn-sm mb-3" @click="onSubmitOffer()">
              Submit offer
            </button>
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
      items: [],
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
          key: 'vendor_price',
          label: 'Vendor Price',
        },
        {
          key: 'vendor_stock',
          label: 'Vendor Stock',
        },
        {
          key: 'vendor_incoterms',
          label: 'Vendor Incoterms',
        }
      ],
    }
  },
  mounted() {
    this.getItems()
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
      let { data } = await this.axios.get('supplier/' + this.$route.params.slug + '/request-for-quotation/' + this.$route.params.id)

      this.code = data.data.code
      this.status = data.data.status

      this.items = data.data
        .map(item => {
          let result = item.request_quotation.find(requestQuotation => requestQuotation.vendor.slug == this.$route.params.slug)
          item.requestQuotationId = result.id
          item.vendor_price = result.vendor_price ? result.vendor_price : null
          item.vendor_stock = result.vendor_stock ? result.vendor_stock : null
          item.vendor_incoterms = result.vendor_incoterms ? result.vendor_incoterms : 'Free On Board'
          return item
        })

      this.loading = false
    },
    async onSubmitOffer() {
      let readySubmit = true
      await this.items.forEach(item => {

        if (!item.vendor_price || !item.vendor_stock || !item.vendor_incoterms) readySubmit = false
      })

      if (readySubmit) {
        let items = this.items.map(item => {
          return {
            id: item.requestQuotationId,
            vendor_price: parseInt(item.vendor_price),
            vendor_stock: parseInt(item.vendor_stock),
            vendor_incoterms: item.vendor_incoterms
          }
        })

        let { data } = await this.axios.post(`supplier/${this.$route.params.slug}/request-for-quotation/${this.$route.params.id}/send-offer`, {
          items: items
        })

        if (data.status == "SUCCESS") {
          alert(data.message)
          this.getItems()
        } else {
          alert(data.message)
        }

      } else {
        alert('All item field must be filled!')
      }
    },
  }
}
</script>
