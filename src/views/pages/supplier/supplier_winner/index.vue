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
    <breadcumb :page="'List'" :folder="'Purchase Request'" />

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

          <template #cell(created_at)="{ value }">
            {{ value | luxon }}
          </template>
          <template #cell(updated_at)="{ value }">
            {{ value | luxon }}
          </template>
          <template #cell(total)="{ value }">
            {{ $n(value, 'currency', 'id-ID') }}
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

      <div>
        Aplikasi lama:<br>
        <pre>
       -- No PO
  -- Nama Pemesanan
  -- Tanggal PO Dibuat
  -- Delivery Location
        </pre>
      </div>
    </b-card>
    
  </div>
</template>
<script>
export default {
  metaInfo: {
    title: "Purchase Request",
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      items: [],
      fields: [
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
  methods: {
    async getItems(page) {
      page = page?? 1
      let { data } = await this.axios.get('procurement/purchase-request?page=' + page, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.items = data.data
      this.meta.total = data.meta.total
      this.meta.perPage = data.meta.per_page
      this.meta.currentPage = data.meta.current_page
    },
    onRowSelected(items) {
      this.$router.push({ name: 'procurement-approval-detail', params: {id: items[0].id} })
    },
  }
}
</script>
