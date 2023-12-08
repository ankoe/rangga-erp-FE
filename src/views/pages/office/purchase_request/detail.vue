<template>
  <div class="main-content">
    <breadcumb :page="code" :folder="'Purchase Request'" />

    <b-card class="wrapper mb-4">
      <b-card-header>
        <b-row>
          <b-col lg="3" class="mt-auto">
            <h5>Total : {{ $n(exchange(total), 'currency', getExchangeLocale) }}</h5>
          </b-col>
        </b-row>
      </b-card-header>

      <b-table striped hover :items="items" :fields="fieldItems" responsive="sm" :busy="loading" show-empty>
        <template #empty>
          Data not found or empty
        </template>
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>


        <template #cell(material.stock)="{ value }">
          {{ value.replace('.', ',') }}
        </template>

        <template #cell(quantity)="{ value }">
          {{ value.replace('.', ',') }}
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

    <b-card class="wrapper mb-4">
      <b-row>
        <b-col md="6">
          <h4 class="mb-3">Approval Sequence</h4>
          <b-table striped hover :items="approvals" :fields="fieldApprovals" responsive="sm" :busy="loading" show-empty>
            <template #empty>
              Data not found or empty
            </template>
            <template #table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>

            <template #cell(material.stock)="{ value }">
              {{ $n(value, 'numbering', getExchangeLocale) }}
            </template>

            <template #cell(quantity)="{ value }">
              {{ $n(value, 'numbering', getExchangeLocale) }}
            </template>

            <template #cell(approve_user)="{ value }">
              <template v-if="value">
                {{ value.name }}
              </template>
              <template v-else>-</template>
            </template>

            <template #cell(approved_at)="{ value }">
              <template v-if="value">
                {{ value }}
              </template>
              <template v-else>-</template>
            </template>
          </b-table>
        </b-col>
        <b-col md="6">
          <h4 class="mb-3">Approval History</h4>
          <b-table striped hover :items="approvalHistories" :fields="fieldApprovalHistories" responsive="sm"
            :busy="loading" show-empty>
            <template #empty>
              Data not found or empty
            </template>
            <template #table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>

            <template #cell(user)="{ value }">
              {{ value.name }}
            </template>

            <template #cell(remarks)="{ value }">
              {{ value ? value : '-' }}
            </template>

          </b-table>
        </b-col>
      </b-row>
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
      approvals: [],
      approvalHistories: [],
      id: null,
      code: null,
      total: null,
      status: null,
      fieldItems: [
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
          key: 'material.stock',
          label: 'Stock',
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
      fieldApprovals: [
        {
          key: 'order',
          label: 'Order',
        },
        {
          key: 'role.group',
          label: 'Group',
        },
        {
          key: 'role.display_name',
          label: 'Role',
        },
        {
          key: 'approve_user',
          label: 'Approve User',
        },
        {
          key: 'approved_at',
          label: 'Approved At',
        },
      ],
      fieldApprovalHistories: [
        {
          key: 'role.group',
          label: 'Group',
        },
        {
          key: 'role.display_name',
          label: 'Role',
        },
        {
          key: 'user',
          label: 'User',
        },
        {
          key: 'approved_at',
          label: 'Approve At',
        },
        {
          key: 'approve_status',
          label: 'Status',
        },
        {
          key: 'remarks',
          label: 'Remarks',
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
      let { data } = await this.axios.get('office/purchase-request/' + this.$route.params.id)

      this.id = data.data.id
      this.code = data.data.code
      this.total = data.data.total
      this.status = data.data.status
      this.items = data.data.items
      this.approvals = data.data.approvals.sort((x, y) => x.order - y.order)
      this.approvalHistories = data.data.approval_histories

      this.loading = false
    },
    async onApprove() {
      let { data } = await this.axios.post('office/purchase-request/' + this.$route.params.id + '/approval',
        {
          decision: 'approve'
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
