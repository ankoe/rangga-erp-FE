<template>
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Material'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" offset-lg="9" class="mt-auto">
            <router-link :to="{ name: 'material-create' }" class="btn btn-info btn-block btn-sm mb-3">
              Tambah Material
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
        <template #cell(action)="{ item }">
          <router-link :to="{ name: 'material-edit', params: { id: item.id } }" class="btn btn-info btn-sm">
            Edit
          </router-link>
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
    title: "Material",
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
          key: 'material_category.name',
          label: 'Material Category',
        },
        {
          key: 'name',
          label: 'Name',
        },
        {
          key: 'number',
          label: 'Number',
        },
        {
          key: 'description',
          label: 'Description',
        },
        {
          key: 'uom',
          label: 'UOM',
        },
        {
          key: 'price',
          label: 'Price',
        },
        {
          key: 'stock',
          label: 'Stock',
        },
        {
          key: 'action',
          label: 'Action',
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
      let { data } = await this.axios.get('material?page=' + page)

      this.items = data.data
      this.meta.total = data.meta.total
      this.meta.perPage = data.meta.per_page
      this.meta.currentPage = data.meta.current_page

      this.loading = false
    }
  }
}
</script>
