<template>
  <div class="main-content">
    <breadcumb :page="'Purchase Request'" :folder="'Approval'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" class="mt-auto">
            <h5>Total : {{ $n(exchange(total), 'currency', getExchangeLocale) }}</h5>

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

        <template #cell(file)="{ value }">
          <a :href="value" target="_blank">File</a>
        </template>

        <template #cell(total)="{ value }">
          {{ $n(exchange(value), 'currency', getExchangeLocale) }}
        </template>
      </b-table>

      <b-card-footer>
        <b-row class="mt-4">
          <b-col md="8">
            <h4>Status: {{ status ? status.description : '' }}</h4>
          </b-col>
          <b-col v-if="status && status.title == 'waiting office approval'" md="4" class=" text-right">
            <button type="button" class="btn btn-success btn-sm mb-3" @click="onApprove">
              Approve
            </button>
            <button type="button" class="ml-2 text-white btn btn-danger btn-sm mb-3" @click="onReject">
              Reject
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
      let { data } = await this.axios.get('office/purchase-request/' + this.$route.params.id, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.id = data.data.id
      this.total = data.data.total
      this.status = data.data.status
      this.items = data.data.items
    },
    async onApprove() {
      let { data } = await this.axios.post('office/purchase-request/' + this.$route.params.id + '/approval',
        {
          decision: 'approve'
        },
        {
          headers: { Authorization: 'Bearer ' + this.token }
        })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.getItems()
      } else {
        alert(data.message)
      }
    },
    async onReject() {
      const { value: remarks } = await this.$swal({
        title: 'Reject Request Purchase',
        input: 'textarea',
        inputPlaceholder: 'Remarks',
        inputAttributes: {
          'aria-label': 'Remarks'
        },
        showCancelButton: true,
        inputValidator: (result) => {
          return !result && 'You need input remarks'
        }
      })

      if (remarks) {
        let { data } = await this.axios.post('office/purchase-request/' + this.$route.params.id + '/approval',
          {
            decision: 'reject',
            remarks
          },
          {
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
}
</script>
