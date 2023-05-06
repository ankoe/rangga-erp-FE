<style  scoped>
.app-footer {
    margin-top: 2rem;
    background: #eee;
    padding: 1.25rem;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: none;
}
</style>
<template>
  <div class="main-content">
    <breadcumb :page="'List'" :folder="'Location'" />

    <b-card class="wrapper">
      <b-card-header>
        <b-row>
          <b-col lg="3" class="mt-auto">
            <b-form-group id="fieldset-1" label="" label-for="input-1">

                <b-form-group id="fieldset-1" label="Filter Status :" label-for="input-1">
                    <b-form-select size="sm" v-model="selected" :options="options"
                        v-on:change="filterStatus()"></b-form-select>
                </b-form-group>
            </b-form-group>

          </b-col>
          <b-col lg="3" offset-lg="6" class="mt-auto">
            <router-link :to="{ name: 'location-create'}" class="btn btn-info btn-block btn-sm mb-3">
                Tambah Location
            </router-link>
          </b-col>
        </b-row>
      </b-card-header>

      <b-table striped hover :items="items" :fields="fields" responsive="sm" selectable @row-selected="onRowSelected" :busy="loading" show-empty>
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
            <router-link :to="{ name: 'location-edit', params: { id: item.id } }" class="btn btn-info btn-sm">
              Edit
            </router-link>
          </template>
      </b-table>

      <div class="mt-3">
        <b-pagination
          v-model="meta.currentPage"
          :total-rows="meta.total"
          :per-page="meta.perPage"
          first-text="First"
          prev-text="Prev"
          next-text="Next"
          last-text="Last"
          align="right"
          @change="getItems"
        ></b-pagination>
      </div>
    </b-card>
    
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      token: localStorage.getItem("token"),
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
      page = page?? 1
      let { data } = await this.axios.get('branch?page=' + page, {
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
