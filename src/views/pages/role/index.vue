<template>
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Role'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" offset-lg="9" class="mt-auto">
            <router-link :to="{ name: 'role-create' }" class="btn btn-info btn-block btn-sm mb-3">
              Tambah Role
            </router-link>
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

        <template #cell(action)="{ item }">
          <router-link v-if="!item.is_default" :to="{ name: 'role-edit', params: { id: item.id } }"
            class="btn btn-info btn-sm">
            Edit
          </router-link>
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
    title: "Role"
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      loading: false,
      items: [],
      fields: [
        {
          key: 'display_name',
          label: 'Name',
        },
        {
          key: 'group',
          label: 'Group',
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
      let { data } = await this.axios.get('role?page=' + page, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.items = data.data
      this.meta.total = data.meta.total
      this.meta.perPage = data.meta.per_page
      this.meta.currentPage = data.meta.current_page
    }
  }
}
</script>
