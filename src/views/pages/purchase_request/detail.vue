<template>
  <div class="main-content">
    <breadcumb :page="'Blank'" :folder="'Pages'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" class="mt-auto">
            <h5>Total : {{ $n(exchange(total), 'currency', getExchangeLocale) }}</h5>

          </b-col>
          <b-col lg="3" offset-lg="6" class="mt-auto">
            <router-link v-if="isEditable" :to="{ name: 'purchase-request-item-create', params: { id } }"
              class="btn btn-info btn-block btn-sm mb-3">
              Tambah Item
            </router-link>
          </b-col>
        </b-row>
      </b-card-header>

      <b-table striped hover :items="items" :fields="fields" responsive="sm" :busy="loading" show-empty>
        <template #empty="scope">
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

        <template #cell(file)="{ value, item }">
          <a :href="value" target="_blank">File</a>
        </template>

        <template #cell(total)="{ value }">
          {{ $n(exchange(value), 'currency', getExchangeLocale) }}
        </template>

        <template #cell(action)="{ item }">
          <div v-if="isEditable">
            <router-link
              :to="{ name: 'purchase-request-item-edit', params: { id: item.purchase_request_id, item: item.id } }"
              class="btn btn-info btn-sm">
              Edit
            </router-link>
            <button type="button" class="btn btn-danger btn-sm" @click="onDeleteItem(item)">
              Delete
            </button>
          </div>
          <span v-else class="font-italic small text-secondary">
            Can't modify
          </span>
        </template>
      </b-table>

      <b-card-footer>
        <b-row class="mt-4">
          <b-col md="8">
            <h4>Status: {{ status ? status.description : '' }}</h4>
          </b-col>
          <b-col v-if="isEditable" class="text-right">
            <button type="button" class="btn btn-success btn-sm mb-3" @click="submitPR">
              Submit PR
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
      token: localStorage.getItem("token"),
      loading: false,
      items: [],
      id: null,
      total: null,
      status: null,
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
    ...mapGetters(["getRate", "getExchangeLocale"]),
    isEditable() {
      return this.status ? ['draft', 'reject office approval'].includes(this.status.title) : false
    }
  },
  methods: {
    exchange(value) {
      return value * this.getRate
    },
    async getItems() {
      this.loading = true
      let { data } = await this.axios.get('purchase-request/' + this.$route.params.id, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.id = data.data.id
      this.total = data.data.total
      this.status = data.data.status
      this.items = data.data.items

      this.loading = false
    },
    async onDeleteItem(item) {
      let result = confirm('Apakah yakin akan menghapus ' + item.material.name + '?')
      if (result) {
          let { data } = await this.axios.delete('purchase-request-item/' + item.id, {
          headers: { Authorization: 'Bearer ' + this.token }
        })

        if (data.status == "SUCCESS") {
          this.getItems()
        } else {
          alert(data.message)
        }

      }
    },
    async submitPR() {
      let { data } = await this.axios.get('purchase-request/' + this.$route.params.id + '/apply', {
        headers: { Authorization: 'Bearer ' + this.token }
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
