<template>
  <div class="main-content">
    <breadcumb :page="'-'" :folder="'Purchase Order'" />

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

        <template #cell(quantity)="{ value }">
          {{ $n(value, 'numbering', getExchangeLocale) }}
        </template>

        <template #cell(vendor_stock)="{ value }">
          {{ $n(value, 'numbering', getExchangeLocale) }}
        </template>

        <template #cell(expected_at)="{ value }">
          {{ value | luxon({ output: { format: "dd-MM-yyyy" } }) }}
        </template>

        <template #cell(file)="{ value }">
          <a :href="value" target="_blank">File</a>
        </template>
      </b-table>

      <b-card-footer>
        <b-row v-if="!isAgree" class="mt-4">
          <b-col offset-md="8" class="text-right">
            <button type=" button" class="btn btn-danger btn-sm mb-3" @click="onReject()">
              Reject
            </button>
            <button type=" button" class="btn btn-success btn-sm mb-3 ml-2" @click="onApprove()">
              Approve
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
      isAgree: false,
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
        },
      ],
    }
  },
  mounted() {
    this.getItems()
  },
  computed: {
    ...mapGetters(["getRate", "getExchangeLocale"])
  },
  methods: {
    exchange(value) {
      return value * this.getRate
    },
    async getItems() {
      this.loading = true
      let { data } = await this.axios.get('supplier/' + this.$route.params.slug + '/purchase-order/' + this.$route.params.id)

      this.items = data.data
        .map(item => {
          let result = item.request_quotation.find(requestQuotation => requestQuotation.vendor.slug == this.$route.params.slug)

          item.requestQuotationId = result.id
          item.rq_vendor_id = result.vendor.id
          item.is_selected = result.is_selected
          item.vendor_is_agree = result.vendor_is_agree
          item.vendor_price = result.vendor_price
          item.vendor_stock = result.vendor_stock
          item.vendor_incoterms = result.vendor_incoterms

          if (typeof result.vendor_is_agree === 'boolean') this.isAgree = true

          return item
        })

      this.loading = false
    },
    async onApprove() {

      let purchaseRequestItems = []
      let requestQuotations = []

      this.items.forEach(item => {
        if (item.is_selected) {
          purchaseRequestItems.push({
            id: item.id,
            vendor_id: item.rq_vendor_id,
            vendor_price: item.vendor_price,
            vendor_stock: item.vendor_stock,
            vendor_incoterms: item.vendor_incoterms,
          })
          requestQuotations.push(item.requestQuotationId)
        }
      })

      let { data } = await this.axios.post(`supplier/${this.$route.params.slug}/purchase-order/${this.$route.params.id}/set-approve`, {
        purchase_request_items: purchaseRequestItems,
        request_quotations: requestQuotations
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.getItems()
      } else {
        alert(data.message)
      }
    },
    async onReject() {

      let requestQuotations = []

      this.items.forEach(item => {
        if (item.is_selected) {
          requestQuotations.push(item.requestQuotationId)
        }
      })

      let { data } = await this.axios.post(`supplier/${this.$route.params.slug}/purchase-order/${this.$route.params.id}/set-reject`, {
        request_quotations: requestQuotations
      })

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
