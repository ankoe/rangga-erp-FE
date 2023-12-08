<template>
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Unit'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" offset-lg="9" class="mt-auto">
            <router-link :to="{ name: 'unit-create' }" class="btn btn-info btn-block btn-sm mb-3">
              Tambah Unit
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
          <template v-if="!item.is_default">
            <router-link :to="{ name: 'unit-edit', params: { id: item.id } }" class="btn btn-info btn-sm py-1 px-2">
              Edit
            </router-link>
            <b-button size="sm" variant="danger" class="ml-1 py-1 px-2" @click="onDelete(item)">Hapus</b-button>
          </template>
          <span v-else class="font-italic small text-secondary">Cant be modify</span>
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
    title: "Unit"
  },
  data() {
    return {
      loading: false,
      items: [],
      fields: [
        {
          key: 'name',
          label: 'Name',
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
      page = page ?? 1
      let { data } = await this.axios.get('unit?page=' + page)

      this.items = data.data
      this.meta.total = data.meta.total
      this.meta.perPage = data.meta.per_page
      this.meta.currentPage = data.meta.current_page
    },
    async onDelete(item) {
      await this.axios.delete('unit/' + item.id)

      this.getItems()
    },
  }
}
</script>
