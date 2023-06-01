<template>
  <div class="main-content">
    <breadcumb :page="'Create'" :folder="'Role'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-alert show variant="info" class="mb-4">Will have level in supervisor (approval role)</b-alert>

        <b-card>
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group class="col-md-6 mb-3" label="Name*" label-for="input-1">
                  <ValidationProvider ref="name" name="Name" rules="required|max:50" v-slot="{ errors }">
                    <b-form-input v-model="form.name" type="text" placeholder="Name"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group label="Group*" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="group" name="Group" rules="required" v-slot="{ errors }">
                    <b-form-select v-model="form.group" :options="groups" id="inline-form-custom-select-pref1">
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select group --</b-form-select-option>
                      </template>
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
      form: {
        name: null,
        group: null
      },
      groups: ['office', 'procurement']
    }
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.post('role', {
        name: this.form.name,
        group: this.form.group
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
    }
  }
};
</script>
