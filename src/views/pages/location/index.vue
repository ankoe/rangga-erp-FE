<template>
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Location'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" offset-lg="9" class="mt-auto">
            <router-link :to="{ name: 'location-create' }" class="btn btn-info btn-block btn-sm mb-3">
              Tambah Location
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
        <template #cell(email)="{ value }">
          {{ value ? value : '-' }}
        </template>
        <template #cell(mobile)="{ value }">
          {{ value ? value : '-' }}
        </template>
        <template #cell(address)="{ value }">
          {{ value ? value : '-' }}
        </template>
        <template #cell(action)="{ item }">
          <router-link :to="{ name: 'location-edit', params: { id: item.id } }" class="btn btn-info btn-sm py-1 px-2">
            Edit
          </router-link>
          <b-button size="sm" variant="danger" class="ml-1 py-1 px-2" @click="onDelete(item)">Hapus</b-button>
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
    title: "Location",
  },
  data() {
    return {
      loading: false,
      filter: {
        selected: null,
        options: []
      },
      items: [],
      fields: [
        {
          key: 'name',
          label: 'Name',
        },
        {
          key: 'address',
          label: 'Address',
        },
        {
          key: 'email',
          label: 'Email',
        },
        {
          key: 'mobile',
          label: 'Mobile',
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
      let { data } = await this.axios.get('branch?page=' + page)

      this.items = data.data
      this.meta.total = data.meta.total
      this.meta.perPage = data.meta.per_page
      this.meta.currentPage = data.meta.current_page

      this.loading = false
    },
    async onDelete(item) {
      let { data } = await this.axios.delete('branch/' + item.id)

      this.getItems()
    },
  }
}
</script>
