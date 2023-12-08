<template>
  <div class="main-content">
    <breadcumb :page="code" :folder="'Purchase Request'" />

    <b-card class="wrapper mb-4">
      <b-card-header>
        <b-row>
          <b-col lg="3" class="mt-auto">
            <h5 class="mb-1">Total : {{ $n(exchange(total), 'currency', getExchangeLocale) }}</h5>

          </b-col>
          <b-col v-if="isEditable" lg="4" offset-lg="5" class="mt-auto text-right">
            <router-link :to="{ name: 'purchase-request-item-create', params: { id } }"
              class="btn btn-info btn-sm mb-1 mr-2">
              Tambah Item
            </router-link>
            <button type="button" class="btn btn-danger btn-sm mb-1" @click="onDeleteRequest">
              Delete Purchase Request
            </button>
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


        <template #cell(quantity)="{ value }">
          {{ $n(value, 'numbering', getExchangeLocale) }}
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

        <template #cell(is_approve)="{ value }">
          {{ typeof value === 'boolean' ? ((value) ? 'Approve' : 'Reject') : '-' }}
        </template>

        <template #cell(remarks)="{ value }">
          {{ value ? value : '-' }}
        </template>

        <template #cell(action)="{ item }">
          <div v-if="isEditable">
            <router-link
              :to="{ name: 'purchase-request-item-edit', params: { id: item.purchase_request_id, item: item.id } }"
              class="btn btn-info btn-sm py-1 px-2 mb-1">
              Edit
            </router-link>
            <button type="button" class="btn btn-danger btn-sm py-1 px-2 mb-1" @click="onDeleteItem(item)">
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
          key: 'is_approve',
          label: 'Status',
        },
        {
          key: 'remarks',
          label: 'Remarks',
        },
        {
          key: 'action',
          label: 'Action',
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
      let { data } = await this.axios.get('purchase-request/' + this.$route.params.id)
      this.id = data.data.id
      this.code = data.data.code
      this.total = data.data.total
      this.status = data.data.status
      this.items = data.data.items
      this.approvals = data.data.approvals.sort((x, y) => x.order - y.order)
      this.approvalHistories = data.data.approval_histories

      this.loading = false
    },
    async onDeleteRequest() {
      let result = confirm('Apakah yakin akan menghapus ' + this.code + '?')
      if (result) {
        let { data } = await this.axios.delete('purchase-request/' + this.id)

        if (data.status == "SUCCESS") {
          this.$router.push({ name: 'purchase-request-index' })
        } else {
          alert(data.message)
        }

      }
    },
    async onDeleteItem(item) {
      let result = confirm('Apakah yakin akan menghapus ' + item.material.name + '?')
      if (result) {
        if (this.items.length > 1) {
          let { data } = await this.axios.delete('purchase-request-item/' + item.id)

          if (data.status == "SUCCESS") {
            this.getItems()
          } else {
            alert(data.message)
          }
        } else {
          let { data } = await this.axios.delete('purchase-request/' + this.id)

          if (data.status == "SUCCESS") {
            this.$router.push({ name: 'purchase-request-index' })
          } else {
            alert(data.message)
          }
        }

      }
    },
    async submitPR() {
      let { data } = await this.axios.get('purchase-request/' + this.$route.params.id + '/apply')

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
