<template>
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Purchase Request'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" class="mt-auto">
            <b-form-group id="fieldset-1" label="" label-for="input-1">

              <b-form-group id="fieldset-1" label="Filter Status :" label-for="input-1">
                <b-form-select size="sm" v-model="filter.selected" :options="filter.options" v-on:change="getItems()">
                  <template #first>
                    <b-form-select-option :value="null">All</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-form-group>

          </b-col>
        </b-row>
      </b-card-header>

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
      filter: {
        selected: null,
        options: [],
      },
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
    this.getFilterOptions()
  },
  computed: {
    ...mapGetters(["getRate", "getExchangeLocale"])
  },
  methods: {
    exchange(value) {
      return value * this.getRate
    },
    async getFilterOptions() {
      let { data } = await this.axios.get('purchase-request-status/all')
      this.filter.options = data.map(option => {
        return { value: option.id, text: option.description }
      })
    },
    async getItems(page) {
      this.loading = true
      page = page ?? 1
      let { data } = await this.axios.get('procurement/purchase-request?page=' + page)

      this.items = data.data
      this.meta.total = data.meta.total
      this.meta.perPage = data.meta.per_page
      this.meta.currentPage = data.meta.current_page

      this.loading = false
    },
    onRowSelected(items) {
      this.$router.push({ name: 'procurement-purchase-request-detail', params: { id: items[0].id } })
    },
  }
}
</script>
