<template>
  <div class="main-content">
    <breadcumb :page="'Approval'" :folder="'Config'" />

    <b-row class="mb-4">
      <b-col md="10">
        <b-alert show variant="warning" class="text-center">Will effect with new procurement</b-alert>
      </b-col>
      <b-col md="2" class="text-right">
        <button type="button" class="btn-sm btn btn-success" @click="onSave">Simpan</button>
      </b-col>
    </b-row>

    <b-row>
      <!-- column-one -->
      <b-col md="6" class="mb-30">
        <b-card>
          <div class="d-flex justify-content-between mb-3">
            <p class="card-title m-0">Office</p>

            <div class="btn-group">
              <b-button variant="primary" @click="onShowModal('office')">Add Role in Office</b-button>
            </div>
          </div>
          <b-row>
            <b-col md="12">
              <draggable v-bind="dragOptions" group="office" @start="drag = true" @end="drag = false">
                <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                  <b-card class="mb-30 cursor-pointer" v-for="(office, index) in offices" :key="office.role.id">
                    <div class="d-flex justify-content-between">
                      <h6 class="text-muted mb-1">{{ office.role.display_name }}</h6>
                      <button v-if="offices.length > 1" type="button" class="btn-sm btn btn-danger"
                        @click="onDeleteOffice(index)">
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
              <b-button variant="primary" @click="onShowModal('procurement')">Add Role in Procurement</b-button>
            </div>
          </div>
          <b-row>
            <b-col md="12">
              <draggable v-bind="dragOptions" group="procurement" @start="drag = true" @end="drag = false">
                <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                  <b-card class="mb-30 cursor-pointer" v-for="(procurement, index) in procurements"
                    :key="procurement.role.id">
                    <div class="d-flex justify-content-between">
                      <h6 class="text-muted mb-1">{{ procurement.role.display_name }}</h6>
                      <button v-if="procurements.length > 1" type="button" class="btn-sm btn btn-danger"
                        @click="onDeleteProcurement(index)">
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

    <b-modal id="modal-add" centered :title="getModalTitle" ref="modal" @show="resetModal" @hidden="resetModal"
      @ok="handleOk">
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group label="Role" label-for="role-select" invalid-feedback="Role is required" :state="modal.nameState">
          <b-form-select v-model="modal.role_id" :options="getRoleOptions()" id="role-select" :state="modal.nameState"
            required>
            <template #first>
              <b-form-select-option :value="null" disabled>-- Please select role --</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </form>
    </b-modal>

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
      roles: [],
      offices: [],
      procurements: [],
      modal: {
        group: 'office',
        role_id: null,
        nameState: null
      },
      drag: false
    };
  },
  mounted() {
    this.getItems()
    this.getRoles()
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      }
    },
    getModalTitle() {
      return this.modal.group == 'office' ? 'Add Role in Office' : 'Add Role in Procurement'
    }
  },
  methods: {
    async getItems() {
      let { data } = await this.axios.get('config-approval')

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
      let { data } = await this.axios.get('role/all')

      this.roles = data.data
    },
    onShowModal(group = 'office') {
      this.modal.group = group
      this.$bvModal.show('modal-add')
    },
    getRoleOptions() {
      const exceptRole = this.modal.group == 'office' ? ['admin', 'user'] : ['officer']
      const approvalList = this.modal.group == 'office' ? this.offices : this.procurements

      return this.roles.filter(role => role.group == this.modal.group && !exceptRole.includes(role.display_name)).map(role => {
        const isInclude = approvalList.some(list => list.role.id === role.id)
        return { value: role.id, text: role.display_name + (isInclude ? ' (selected)' : ''), disabled: isInclude }
      })
    },
    resetModal() {
      this.modal.role_id = null
      this.modal.nameState = null
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.modal.nameState = valid
      return valid
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // Push the name to submitted names
      const role = this.roles.find(role => role.id == this.modal.role_id)
      if (this.modal.group == 'office')
        this.offices.push({ id: null, order: null, role })
      else
        this.procurements.push({ id: null, order: null, role })
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-add')
      })
    },
    onDeleteOffice(index) {
      this.offices.splice(index, 1)
    },
    onDeleteProcurement(index) {
      this.procurements.splice(index, 1)
    },
    async onSave() {
      let approvals = []
      let order = 1

      this.offices.forEach(office => {
        approvals.push({ role_id: office.role.id, order: order++ })
      })

      this.procurements.forEach(office => {
        approvals.push({ role_id: office.role.id, order: order++ })
      })

      let { data } = await this.axios.put('config-approval/sort',
        {
          approvals
        })

      alert(data.message)
    },
  }
};
</script>
