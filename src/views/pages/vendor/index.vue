<template>
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Vendor'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" offset-lg="9" class="mt-auto">
            <router-link :to="{ name: 'vendor-create' }" class="btn btn-info btn-block btn-sm mb-3">
              Tambah Vendor
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

        <template #cell(action)="{ item }">
          <router-link :to="{ name: 'vendor-edit', params: { id: item.id } }" class="btn btn-info btn-sm">
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
export default {
  metaInfo: {
    title: "Vendor",
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      loading: false,
      filter: {
        selected: null,
        options: [],
      },
      items: [],
      fields: [
        {
          key: 'name',
          label: 'Name',
        },
        {
          key: 'email',
          label: 'Email',
        },
        {
          key: 'material_category.name',
          label: 'material category',
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
  methods: {
    async getItems(page) {
      this.loading = true
      page = page ?? 1
      let { data } = await this.axios.get('vendor?page=' + page, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.items = data.data
      this.meta.total = data.meta.total
      this.meta.perPage = data.meta.per_page
      this.meta.currentPage = data.meta.current_page

      this.loading = false
    }
  }
}
</script>
