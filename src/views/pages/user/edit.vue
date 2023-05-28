<template>
  <div class="main-content">
    <breadcumb :page="'Edit'" :folder="'User'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card>
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group class="col-md-6 mb-3" label="Name*" label-for="input-1">
                  <ValidationProvider ref="name" name="Name" rules="required|max:40" v-slot="{ errors }">
                    <b-form-input v-model="form.name" type="text" placeholder="Name"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="Email*" label-for="input-1">
                  <ValidationProvider ref="email" name="Email" rules="required|email" v-slot="{ errors }">
                    <b-form-input v-model="form.email" type="email" readonly placeholder="Email"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="Phone" label-for="input-1">
                  <ValidationProvider ref="mobile" name="Phone" rules="numeric|min:11|max:13" v-slot="{ errors }">
                    <b-form-input v-model="form.mobile" type="text" placeholder="Phone"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group label="Role*" label-for="input-1" class="col-md-6">
                  <ValidationProvider ref="role" name="Role" rules="required" v-slot="{ errors }">
                    <b-form-select v-model="form.role_id" :options="roles" id="inline-form-custom-select-pref1">
                      <template #first>
                        <b-form-select-option :value="null" disabled>-- Please select role --</b-form-select-option>
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
    title: "User",
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      form: {
        name: null,
        email: null,
        mobile: null,
        role_id: null,
        is_active: null,
      }
    }
  },
  mounted() {
    this.getRoles()
    this.getDetail()
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.put('user/' + this.$route.params.id, {
        name: this.form.name,
        email: this.form.email,
        mobile: this.form.mobile,
        role_id: this.form.role_id,
        is_active: this.form.is_active ? 'true' : 'false',
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push({ name: 'user-index' })
      } else {
        if (data.data) {
          this.$refs.name.applyResult({ errors: data.data.name ?? [] })
          this.$refs.email.applyResult({ errors: data.data.email ?? [] })
          this.$refs.mobile.applyResult({ errors: data.data.mobile ?? [] })
          this.$refs.role.applyResult({ errors: data.data.role_id ?? [] })
        } else {
          alert(data.message)
        }
      }
    },
    async getDetail() {
      let { data } = await this.axios.get('user/' + this.$route.params.id, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      console.log(data.data)

      if (data.status == "SUCCESS") {
        this.form.name = data.data.name
        this.form.email = data.data.email
        this.form.mobile = data.data.mobile
        this.form.role_id = data.data.roles[0].id
        this.form.is_active = data.data.is_active
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    },
    async getRoles() {
      let { data } = await this.axios.get('role', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.roles = data.data.map(role => {
        return { value: role.id, text: `${role.group} - ${role.display_name}` }
      })
    }
  }
};
</script>
