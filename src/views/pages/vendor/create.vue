<template>
  <div class="main-content">
    <breadcumb :page="'Create'" :folder="'Vendor'" />

    <b-row>
      <b-col md="12 mb-30">
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

                <b-form-group class="col-md-6 mb-3" label="Email*" label-for="input-1">
                  <ValidationProvider ref="email" name="Email" rules="required|email|max:50" v-slot="{ errors }">
                    <b-form-input v-model="form.email" type="email" placeholder="Email"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group class="col-md-6 mb-3" label="Email CC (multiple)*" label-for="input-1">
                  <ValidationProvider ref="emailCc" name="Email CC" rules="" v-slot="{ errors }">
                    <vue-tags-input v-model="form.emailCc" :tags="form.emailCcs"
                      @tags-changed="newEmailCcs => form.emailCcs = newEmailCcs" class="tag-custom border rounded"
                      placeholder="input multiple email CC" />
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

                <b-form-group label="Material Category (multiple)*" label-for="input-1" class="col-md-6 mb-3">
                  <ValidationProvider ref="category" name="Material Category" rules="" v-slot="{ errors }">
                    <vue-tags-input v-model="form.category" :tags="form.categories"
                      @tags-changed="newCategories => form.categories = newCategories"
                      :autocomplete-items="filteredCategories" :add-only-from-autocomplete="true"
                      class="tag-custom border rounded" placeholder="select material categories" />
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
    title: "Vendor",
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      form: {
        name: null,
        email: null,
        category: '',
        categories: [],
        emailCc: '',
        emailCcs: [],
        mobile: '',
        mobiles: []
      },
      materialCategories: []
    }
  },
  mounted() {
    this.getMaterialCategories()
  },
  computed: {
    filteredCategories() {
      return this.materialCategories.filter(category => {
        return category.text.toLowerCase().indexOf(this.form.category.toLowerCase()) !== -1;
      });
    },
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.post('vendor', {
        name: this.form.name,
        email: this.form.email,
        material_categories: this.form.categories.map(tag => tag.value),
        email_ccs: this.form.emailCcs.map(tag => tag.text),
        mobiles: this.form.mobiles.map(tag => tag.text)
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push({ name: 'vendor-index' })
      } else {
        if (data.data) {
          this.$refs.name.applyResult({ errors: data.data.name ?? [] })
          this.$refs.email.applyResult({ errors: data.data.email ?? [] })
          this.$refs.category.applyResult({ errors: data.data.material_categories ?? [] })
          this.$refs.mobile.applyResult({ errors: data.data.mobiles ?? [] })
          this.$refs.emailCc.applyResult({ errors: data.data.email_ccs ?? [] })
        } else {
          alert(data.message)
        }
      }
    },
    async getMaterialCategories() {
      let { data } = await this.axios.get('material-category', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      this.materialCategories = data.data.map(materialCategory => {
        return { value: materialCategory.id, text: materialCategory.name }
      })
    }
  }
};
</script>

<style lang="css">
.vue-tags-input.ti-focus .ti-input {
  border: 1px solid #ebde6e;
}
</style>