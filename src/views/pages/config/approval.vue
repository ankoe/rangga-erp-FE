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
    <breadcumb :page="'Approval'" :folder="'Config'" />

    <b-row>
      <!-- column-one -->
      <b-col md="6" class="mb-30">
        <b-card>
          <div class="d-flex justify-content-between mb-3">
            <p class="card-title m-0">Office</p>

            <div class="btn-group">
              <b-button variant="primary">Add Role in Office</b-button>
            </div>
          </div>
          <b-row>
            <b-col md="12">
              <draggable
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
              >
                <transition-group
                  type="transition"
                  :name="!drag ? 'flip-list' : null"
                >
                  <b-card
                    class="mb-30 cursor-pointer"
                    v-for="(office, index) in offices"
                    :key="office.role.id"
                  >
                    <div class="d-flex justify-content-between">
                      <h6 class="text-muted mb-1">{{ office.role.display_name }}</h6>
                      <button type="button" class="btn-sm btn btn-danger" @click="onDeleteOffice(index)">
                        <i class="nav-icon i-Close-Window"></i>
                      </button>
                    </div>
                  </b-card>
                </transition-group>
              </draggable>
            </b-col>
          </b-row>
        </b-card>
      </b-col>

      <!-- column-two -->
      <b-col md="6" class="mb-30">
        <b-card>
          <div class="d-flex justify-content-between mb-3">
            <p class="card-title m-0">Procurement</p>

            <div class="btn-group">
              <b-button variant="primary">Add Role in Procurement</b-button>
            </div>
          </div>
          <b-row>
            <b-col md="12">
              <draggable
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
              >
                <transition-group
                  type="transition"
                  :name="!drag ? 'flip-list' : null"
                >
                  <b-card
                    class="mb-30 cursor-pointer"
                    v-for="(procurement, index) in procurements"
                    :key="procurement.role.id"
                  >
                    <div class="d-flex justify-content-between">
                      <h6 class="text-muted mb-1">{{ procurement.role.display_name }}</h6>
                      <button type="button" class="btn-sm btn btn-danger" @click="onDeleteProcurement(index)">
                        <i class="nav-icon i-Close-Window"></i>
                      </button>
                    </div>
                  </b-card>
                </transition-group>
              </draggable>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
import draggable from "vuedraggable"

export default {
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: "Config - Approval"
  },
  display: "Transitions",
  order: 7,
  components: {
    draggable
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      roles: [],
      offices: [],
      procurements: [],

      drag: false
    };
  },
  mounted() {
    this.getItems()
    this.getRoles()
  },
  methods: {
    async getItems() {
      let { data } = await this.axios.get('config-approval', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      await data.data.forEach((approval) => {
         if (approval.role.group == 'office') {
          this.offices.push(approval)
         } else {
          this.procurements.push(approval)
         }
      })
      // perlu disorting
    },
    async getRoles() {
      let { data } = await this.axios.get('role/all', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.roles = data.data
    },
    onDeleteOffice(index) {
      this.offices.splice(index, 1)
    },
    onDeleteProcurement(index) {
      this.procurements.splice(index, 1)
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  }
};
</script>
