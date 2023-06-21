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

        <template #cell(price)="{ value }">
          {{ $n(exchange(value), 'currency', getExchangeLocale) }}
        </template>

        <template #cell(expected_at)="{ value }">
          {{ value | luxon({ output: { format: "dd-MM-yyyy" } }) }}
        </template>

        <template #cell(file)="{ value }">
          <a :href="value" target="_blank">File</a>
        </template>

        <template #cell(status)="{ item }">
          <span v-if="item.winning_vendor" class="text-success">PO done</span>
          <span v-else class="text-danger">Waiting vendor agree</span>
        </template>

        <template #cell(winning_vendor)="{ value }">
          {{ value ? value.name : '-' }}
        </template>

        <template #cell(winning_vendor_price)="{ value }">
          {{ value ? $n(exchange(value), 'currency', getExchangeLocale) : '-' }}
        </template>

        <template #cell(winning_vendor_stock)="{ value }">
          {{ value ? value : '-' }}
        </template>

        <template #cell(winning_vendor_incoterms)="{ value }">
          {{ value ? value : '-' }}
        </template>

        <template #cell(action)="{ item }">
          <b-button v-if="item.winning_vendor" type="button" variant="success" size="sm" class="py-1 px-2"
            @click="onGeneratePO(item)">Download Dokumen PO</b-button>
          <span v-else>-</span>
        </template>

      </b-table>
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
        // {
        //   key: 'vendor.name',
        //   label: 'Proposed Supplier',
        // },
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
          key: 'status',
          label: 'Status',
        },
        {
          key: 'winning_vendor',
          label: 'Vendor',
        },
        {
          key: 'winning_vendor_price',
          label: 'Vendor Price',
        },
        {
          key: 'winning_vendor_stock',
          label: 'Vendor Stock',
        },
        {
          key: 'winning_vendor_incoterms',
          label: 'Vendor Incoterms',
        },
        // {
        //   key: 'total',
        //   label: 'Total Value',
        // },
        {
          key: 'action',
          label: 'Action',
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
      let { data } = await this.axios.get('procurement/purchase-order/' + this.$route.params.id)

      this.items = data.data.items

      this.loading = false
    },
    onGeneratePO(item) {
      const vendorId = item.winning_vendor ? item.winning_vendor.id : null
      this.axios.get('procurement/purchase-order/' + this.$route.params.id + '/generate-po-vendor/' + vendorId)
    }
  }
}
</script>
