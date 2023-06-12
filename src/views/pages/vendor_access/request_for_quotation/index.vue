<template>
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Request for Quotation'" />

    <b-card class="wrapper">

      <b-table striped hover :items="items" :fields="fields" responsive="sm" selectable @row-selected="onRowSelected"
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

        <template #cell(created_at)="{ value }">
          {{ value | luxon }}
        </template>
        <template #cell(updated_at)="{ value }">
          {{ value | luxon }}
        </template>
        <template #cell(total)="{ value }">
          {{ $n(exchange(value), 'currency', getExchangeLocale) }}
        </template>
      </b-table>

      <div class="mt-3">
        <b-pagination v-model="meta.currentPage" :total-rows="meta.total" :per-page="meta.perPage" first-text="First"
          prev-text="Prev" next-text="Next" last-text="Last" align="right" @change="getItems"></b-pagination>
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
      loading: false,
      items: [],
      fields: [
        {
          key: 'code',
          label: 'Number',
        },
        {
          key: 'user.name',
          label: 'Username',
        },
        {
          key: 'status.description',
          label: 'Status',
        },
        {
          key: 'created_at',
          label: 'Created PR',
        },
        {
          key: 'updated_at',
          label: 'updated PR',
        },
        {
          key: 'total',
          label: 'Total Value',
        },
      ],
      meta: {
        total: 0,
        perPage: 10,
        currentPage: 1,
      }
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
    async getItems(page) {
      this.loading = true
      page = page ?? 1
      let { data } = await this.axios.get('supplier/request-for-quotation?page=' + page)

      this.items = data.data
      this.meta.total = data.meta.total
      this.meta.perPage = data.meta.per_page
      this.meta.currentPage = data.meta.current_page

      this.loading = false
    },
    onRowSelected(items) {
      this.$router.push({ name: 'vendor-access-request-for-quotation-detail', params: { id: items[0].id } })
    },
  }
}
</script>
