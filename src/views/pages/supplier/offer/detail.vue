<template>
  <div class="main-content">
    <breadcumb :page="'Blank'" :folder="'Pages'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" class="mt-auto">
            <b-form-group id="fieldset-1" label="" label-for="input-1">

              <b-form-group id="fieldset-1" label="Filter Status :" label-for="input-1">
                <b-form-select size="sm" v-model="selected" :options="options"
                  v-on:change="filterStatus()"></b-form-select>
              </b-form-group>
            </b-form-group>

          </b-col>
          <b-col lg="3" offset-lg="6" class="mt-auto">
            <router-link :to="{ name: 'purchase-request-create' }" class="btn btn-info btn-block btn-sm mb-3">
              Tambah Purchase Request
            </router-link>
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

        <template #cell(action)="{ item }">
          <router-link
            :to="{ name: 'purchase-request-item-edit', params: { id: item.purchase_request_id, item: item.id } }"
            class="btn btn-info btn-sm">
            Edit
          </router-link>
          <router-link :to="{ name: 'purchase-request-edit', params: { id: item.id } }" class="btn btn-danger btn-sm">
            Delete
          </router-link>
        </template>
      </b-table>

      <div>
        Aplikasi lama:<br>
        <pre>
                        -> jika status draft
                 -- no pr item
                 -- material number
                 -- material name
                 -- material desc
                 -- UOM
                 -- QTY
                 -- proposed supplier
                 -- unit price
                 -- unit total
                 -- delivery location
                 -- expected delivery date
                 -- action (send rfq, gambar 1&2)
               -> jika status draft (RFQ)
                 -- material number
                 -- material name
                 -- material desc
                 -- UOM
                 -- QTY
                 -- proposed supplier
                 -- unit price
                 -- unit total
                 -- delivery location
                 -- expected delivery date
                 -- sudah mengirim RFQ
                 + tombol proses
                 + list supplier (nama, tombol delete)
                 + tombol tambah supplier muncul modal (gambar 3)
               -> jika status waiting response supplier
                 -- material number
                 -- material name
                 -- material desc
                 -- UOM
                 -- QTY
                 -- proposed supplier
                 -- unit price
                 -- unit total
                 -- delivery location
                 -- expected delivery date
                 + tombol send rfq
               -> jika status waiting for approval
                 -- material number
                 -- material name
                 -- material desc
                 -- UOM
                 -- QTY
                 -- proposed supplier
                 -- unit price
                 -- unit total
                 -- delivery location
                 -- expected delivery date
                 + tombol send rfq
               -> jika status RFQ Response (evaluation)
                 -- material number
                 -- material name
                 -- material desc
                 -- UOM
                 -- QTY
                 -- proposed supplier
                 -- unit price
                 -- unit total
                 -- delivery location
                 -- expected delivery date
                 + tombol send rfq (gambar 4)
               -> jika status approve
                 -- material number
                 -- material name
                 -- material desc
                 -- UOM
                 -- QTY
                 -- proposed supplier
                 -- unit price
                 -- unit total
                 -- delivery location
                 -- delivery date
                 + tombol lihat dokumen
                 + kirim dokumen ke winning vendor

                      </pre>
      </div>
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
      let { data } = await this.axios.get('supplier/offer/' + this.$route.params.id)

      this.items = data.data.items
    }
  }
}
</script>
