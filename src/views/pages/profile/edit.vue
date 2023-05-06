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
    <breadcumb :page="'Edit'" :folder="'Profile'" />

    
  </div>
</template>
<script>
export default {
  data() {
    return {
      token: localStorage.getItem("token"),
      form: {
        name: null,
        email: null,
        mobile: null,
        image_profile: null
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async onSubmit() {
      let { data } = await axios.post('profile', {
        name: this.form.name,
        mobile: this.form.password,
        image_profile: this.form.image_profile,
      }, {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.$router.push({ name: 'profile-index' })
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    },
    async getDetail() {
      let { data } = await this.axios.get('profile', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        this.form.name = data.data.name
        this.form.email = data.data.email
        this.form.mobile = data.data.mobile
        this.form.image_profile = data.data.image_profile

      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    }
  }
};
</script>
