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
          <b-form-select v-if="status && status.title == 'waiting procurement approval'" :options="['approve', 'reject']"
            v-model="item.decision" id="inline-form-custom-select-pref1">
            <template #first>
              <b-form-select-option :value="null" disabled>--</b-form-select-option>
            </template>
          </b-form-select>
          <span v-else class="text-center">
            -
          </span>
        </template>
      </b-table>

      <b-card-footer>
        <b-row class="mt-4">
          <b-col md="8">
            <h4>Status: {{ status ? status.description : '' }}</h4>
          </b-col>
          <b-col v-if="status && status.title == 'waiting procurement approval'" md="4" class=" text-right">
            <button type="button" class="btn btn-success btn-sm mb-3" @click="onProceed">
              Proceed
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
      items: [],
      approves: [],
      rejects: [],
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
          tdClass: 'text-center'
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
      let { data } = await this.axios.get('procurement/purchase-request/' + this.$route.params.id)

      this.id = data.data.id
      this.total = data.data.total
      this.status = data.data.status
      this.items = data.data.items

      this.loading = false
    },
    async onProceed() {
      console.log(this.items, 'this.item')
      this.approves = []
      this.rejects = []
      this.items.forEach(item => {
        if (!item.decision) {
          alert('All items must choose!')
          return
        } else {
          if (item.decision == 'approve') this.approves.push(item.id)
          else this.rejects.push(item.id)
        }
      })

      let { data } = await this.axios.post('procurement/purchase-request/' + this.$route.params.id + '/approval',
        {
          approve: this.approves,
          reject: this.rejects,
        })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.getItems()
      } else {
        alert(data.message)
      }
    },
  }
}
</script>
