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
    <breadcumb :page="'Edit'" :folder="'Role'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card>
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group
                  class="col-md-6 mb-3"
                  label="Name*"
                  label-for="input-1"
                >
                  <ValidationProvider ref="name" name="Name" rules="required|max:50" v-slot="{ errors }">
                    <b-form-input
                      v-model="form.name"
                      type="text"
                      placeholder="Name"
                    ></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group  label="Group" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="group" name="Group*" rules="required" v-slot="{ errors }">
                    <b-form-select
                    v-model="form.group"
                      :options="groups"
                      id="inline-form-custom-select-pref1"
                    >
                    </b-form-select>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-col md="12" class="d-flex justify-content-end">
                  <b-button class="mt-3" type="submit" variant="primary">Submit</b-button>
                </b-col>
              </b-row>
            </b-form>
          </ValidationObserver>
        </b-card>
      </b-col>
    </b-row>
    
  </div>
</template>
<script>
export default {
  metaInfo: {
    title: "Role",
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      form: {
        name: null,
        group: null
      },
      groups: ['office', 'procurement']
    };
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.put('role/' + this.$route.params.id, {
        name: this.form.name,
        group: this.form.group
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push({ name: 'role-index' })
      } else {
        if (data.data) {
          this.$refs.name.applyResult({ errors: data.data.name ?? [] })
          this.$refs.group.applyResult({ errors: data.data.group ?? [] })
        } else {
          alert(data.message)
        }
      }
    },
    async getDetail() {
      let { data } = await this.axios.get('role/' + this.$route.params.id, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.form.name = data.data.display_name
        this.form.group = data.data.group
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    }
  }
};
</script>
