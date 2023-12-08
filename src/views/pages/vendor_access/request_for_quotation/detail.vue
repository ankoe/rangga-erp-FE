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

        <template #cell(quantity)="{ value }">
          {{ $n(value, 'numbering', getExchangeLocale) }}
        </template>

        <template #cell(expected_at)="{ value }">
          {{ value | luxon({ output: { format: "dd-MM-yyyy" } }) }}
        </template>

        <template #cell(file)="{ value }">
          <a :href="value" target="_blank">File</a>
        </template>

        <template #cell(vendor_price)="{ item }">
          <money v-model="item.vendor_price" type="text" class="form-control form-control-sm" />
        </template>

        <template #cell(vendor_stock)="{ item }">
          <money v-model="item.vendor_stock" type="text" class="form-control form-control-sm" />
          <p v-if="isVendorStockMoreQty" class="text-danger small mt-1">Cant more than qty</p>
        </template>

        <template #cell(vendor_incoterms)="{ item }">
          <b-form-select size="sm" v-model="item.vendor_incoterms" :options="incoterms"></b-form-select>
        </template>

        <template #cell(vendor_delivery_at)="{ item }">
          <b-form-datepicker size="sm" v-model="item.vendor_delivery_at" :min="new Date()"></b-form-datepicker>
        </template>

        <template #cell(vendor_attachment_item)="{ item }">
          <b-form-file size="sm" v-model="item.vendor_attachment_item" placeholder="" />
        </template>

        <template #cell(vendor_remarks)="{ item }">
          <b-form-textarea size="sm" v-model="item.vendor_remarks"></b-form-textarea>
        </template>

      </b-table>

      <b-card-footer>
        <b-row class="mt-4">
          <b-col>
            <h6>Attachment for offer</h6>
            <b-form-file size="sm" v-model="vendor_attachment_header" placeholder="" />
          </b-col>
          <b-col class="text-right" offset-md="8">
            <button type="button" class="btn btn-success btn-sm mb-3" @click="onSubmitOffer()"
              :disabled="isVendorStockMoreQty">
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
      vendor_attachment_header: null,
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
          key: 'material.unit.name',
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
          label: 'Quantity Commitment',
        },
        {
          key: 'vendor_incoterms',
          label: 'Vendor Incoterms',
        },
        {
          key: 'vendor_delivery_at',
          label: 'Commitment Delivery',
        },
        {
          key: 'vendor_attachment_item',
          label: 'Attach',
        },
        {
          key: 'vendor_remarks',
          label: 'Remarks',
        }
      ],
    }
  },
  mounted() {
    this.getItems()
  },
  computed: {
    ...mapGetters(["getRate", "getExchangeLocale"]),
    isVendorStockMoreQty() {
      if (this.items.length) {
        return (this.items[0].quantity < this.items[0].vendor_stock)
      }

      return true
    }
  },
  methods: {
    exchange(value) {
      return value * this.getRate
    },
    async getItems() {
      this.loading = true
      let { data } = await this.axios.get('supplier/' + this.$route.params.slug + '/request-for-quotation/' + this.$route.params.id)

      this.code = data.data.length ? data.data[0].code_rfq : '-'

      this.status = data.data.length ? data.data[0].status : '-'

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
        let formData = new FormData()

        formData.append("id", this.items[0].requestQuotationId)
        formData.append("vendor_price", parseInt(this.items[0].vendor_price))
        formData.append("vendor_stock", parseInt(this.items[0].vendor_stock))
        formData.append("vendor_incoterms", this.items[0].vendor_incoterms)
        formData.append("vendor_delivery_at", this.items[0].vendor_delivery_at ?? '')
        formData.append("vendor_attachment_item", this.items[0].vendor_attachment_item ?? '')
        formData.append("vendor_remarks", this.items[0].vendor_remarks ?? '')
        formData.append("vendor_attachment_header", this.vendor_attachment_header ?? '')

        let { data } = await this.axios.post(`supplier/${this.$route.params.slug}/request-for-quotation/${this.$route.params.id}/send-offer`, formData)

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
