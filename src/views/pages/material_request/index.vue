<template>
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Material Request'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" offset-lg="9" class="mt-auto">
            <router-link :to="{ name: 'material-request-create' }" class="btn btn-info btn-block btn-sm mb-3">
              Request New Material
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
        <template #cell(material_category.name)="{ value }">
          {{ value ? value : '-' }}
        </template>
        <template #cell(attachment)="{ value }">
          <a v-if="value" :href="value" target="_blank">Lihat</a>
          <span v-else>-</span>
        </template>
        <template #cell(price)="{ value }">
          {{ $n(exchange(value), 'currency', getExchangeLocale) }}
        </template>
        <template #cell(stock)="{ value }">
          {{ $n(value, 'numbering', getExchangeLocale) }}
        </template>
        <template #cell(created_at)="{ value }">
          {{ value | luxon }}
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
          key: 'description',
          label: 'Description',
        },
        {
          key: 'unit.name',
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
          key: 'attachment',
          label: 'Attachment',
        },
        {
          key: 'created_at',
          label: 'Created',
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
      let { data } = await this.axios.get('material-request?page=' + page)

      this.items = data.data
      this.meta.total = data.meta.total
      this.meta.perPage = data.meta.per_page
      this.meta.currentPage = data.meta.current_page

      this.loading = false
    },
    async onDelete(item) {
      await this.axios.delete('material/' + item.id)
      this.getItems()
    },
  }
}
</script>
