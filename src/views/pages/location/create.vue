<template>
  <div class="main-content">
    <breadcumb :page="'Create'" :folder="'Location'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card>
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group class="col-md-6 mb-3" label="Name*" label-for="input-1">
                  <ValidationProvider ref="name" name="Name" rules="required|max:100" v-slot="{ errors }">
                    <b-form-input v-model="form.name" type="text" placeholder="Name"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group class="col-md-6 mb-3" label="Email (multiple)*" label-for="input-1">
                  <ValidationProvider ref="email" name="Email" rules="" v-slot="{ errors }">
                    <vue-tags-input v-model="form.email" :tags="form.emails"
                      @tags-changed="newEmails => form.emails = newEmails" class="tag-custom border rounded"
                      placeholder="input multiple email" />
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group class="col-md-6 mb-3" label="Phone (multiple)*" label-for="input-1">
                  <ValidationProvider ref="mobile" name="Phone" rules="" v-slot="{ errors }">
                    <vue-tags-input v-model="form.mobile" :tags="form.mobiles"
                      @tags-changed="newMobiles => form.mobiles = newMobiles" class="tag-custom border rounded"
                      placeholder="input multiple phone" />
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group class="col-md-6 mb-3" label="Address*" label-for="input-1">
                  <ValidationProvider ref="address" name="Address" rules="required|max:100" v-slot="{ errors }">
                    <b-form-input v-model="form.address" type="text" placeholder="Address"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group class="col-md-6 mb-3" label="City*" label-for="input-1">
                  <ValidationProvider ref="city" name="City" rules="required|max:40" v-slot="{ errors }">
                    <b-form-input v-model="form.city" type="text" placeholder="City"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group class="col-md-6 mb-3" label="Postcode*" label-for="input-1">
                  <ValidationProvider ref="postalCode" name="Postcode" rules="required|max:10" v-slot="{ errors }">
                    <b-form-input v-model="form.postalCode" type="text" placeholder="Postcode"></b-form-input>
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
    title: "Location - Create",
  },
  data() {
    return {
      form: {
        name: null,
        address: null,
        city: null,
        postalCode: null,
        email: '',
        emails: [],
        mobile: '',
        mobiles: [],
      },
    }
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.post('branch', {
        name: this.form.name,
        address: this.form.address,
        city: this.form.city,
        postal_code: this.form.postalCode,
        emails: this.form.emails.map(email => email.text),
        mobiles: this.form.mobiles.map(mobile => mobile.text),
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push({ name: 'location-index' })
      } else {
        if (data.data) {
          this.$refs.name.applyResult({ errors: data.data.name ?? [] })
          this.$refs.address.applyResult({ errors: data.data.address ?? [] })
          this.$refs.email.applyResult({ errors: data.data.email ?? [] })
          this.$refs.mobile.applyResult({ errors: data.data.mobile ?? [] })
          this.$refs.city.applyResult({ errors: data.data.city ?? [] })
          this.$refs.postcode.applyResult({ errors: data.data.postcode ?? [] })
        } else {
          alert(data.message)
        }
      }
    },
  }
};
</script>
