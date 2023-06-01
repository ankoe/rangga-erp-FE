<template>
  <div class="main-content">
    <breadcumb :page="'Create'" :folder="'Material Category'" />

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
    title: "Material Category - Create",
  },
  data() {
    return {
      form: {
        name: null
      }
    }
  },
  methods: {
    async onSubmit() {
      let { data } = await this.axios.post('material-category', {
        name: this.form.name
      })

      if (data.status == "SUCCESS") {
        alert(data.message)
        this.$router.push({ name: 'material-category-index' })
      } else {
        if (data.data) {
          this.$refs.name.applyResult({ errors: data.data.name ?? [] })
        } else {
          alert(data.message)
        }
      }
    }
  }
};
</script>
