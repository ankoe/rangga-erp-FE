<template>
  <div class="main-content">
    <breadcumb :page="'Blank'" :folder="'Pages'" />

    <b-alert show variant="warning" class="text-center">
      Jika ada yang tereject akan kembali keseluruhan ke pengusul
    </b-alert>

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

        <template #cell(action)="{ item }">
          <template v-if="status && status.title == 'waiting procurement approval'">
            <b-form-select :options="['approve', 'reject']" v-model="item.decision" id="inline-form-custom-select-pref1">
              <template #first>
                <b-form-select-option :value="null" disabled>--</b-form-select-option>
              </template>
            </b-form-select>
            <b-form-textarea v-model="item.remarks" placeholder="remarks can fill if reject" class="mt-2"
              :disabled="item.decision != 'reject'"></b-form-textarea>
          </template>
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
      total: 0,
      status: null,
      code: null,
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
      this.code = data.data.code
      this.items = data.data.items

      this.loading = false
    },
    async onProceed() {
      let readySubmit = true
      await this.items.forEach(item => {
        if (!item.decision) readySubmit = false
      })

      if (readySubmit) {

        let { data } = await this.axios.post('procurement/purchase-request/' + this.$route.params.id + '/approval',
          {
            items: this.items.map(item => {
              return {
                id: item.id,
                decision: item.decision,
                remarks: item.remarks,
              }
            }),
          })

        if (data.status == "SUCCESS") {
          alert(data.message)
          this.getItems()
        } else {
          alert(data.message)
        }
      } else {
        alert('All items must choose!')
      }
    },
  }
}
</script>
