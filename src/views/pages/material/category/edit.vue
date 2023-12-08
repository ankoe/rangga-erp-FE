<template>
  <div class="main-content">
    <breadcumb :page="'Edit'" :folder="'Material Category'" />

    <b-row>
      <b-col md="12 mb-30">
        <b-card>
          <ValidationObserver v-slot="{ handleSubmit }" ref="form">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
              <b-row>
                <b-form-group class="col-md-6 mb-3" label="Name*" label-for="input-1">
                  <ValidationProvider ref="name" name="Name" rules="required|max:100" v-slot="{ errors }">
                    <b-form-input v-model="form.name" type="text" placeholder="Category Name"></b-form-input>
                    <span class="text-danger small">{{ errors[0] }}</span>
                  </ValidationProvider>
                </b-form-group>
                <b-form-group class="col-md-6 mb-3" label="Taxonomy (readonly)" label-for="input-1">
                  <ValidationProvider ref="taxonomy" name="Taxonomy" rules="required|max:10" v-slot="{ errors }">
                    <b-form-input v-model="form.taxonomy" type="text" placeholder="Taxonomy" readonly></b-form-input>
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
    title: "Material Category",
  },
  data() {
    return {
      form: {
        name: null,
        taxonomy: null
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.put('material-category/' + this.$route.params.id, {
        name: this.form.name,
        taxonomy: this.form.taxonomy
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push({ name: 'material-category-index' })
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    },
    async getDetail() {
      let { data } = await this.axios.get('material-category/' + this.$route.params.id)

      if (data.status == "SUCCESS") {
        this.form.name = data.data.name
        this.form.taxonomy = data.data.taxonomy
      } else {
        if (data.data) {
          this.$refs.name.applyResult({ errors: data.data.name ?? [] })
          this.$refs.taxonomy.applyResult({ errors: data.data.taxonomy ?? [] })
        } else {
          alert(data.message)
        }
      }
    }
  }
};
</script>
