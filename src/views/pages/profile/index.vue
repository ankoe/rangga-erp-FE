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
    <breadcumb :page="'Detail'" :folder="'Profile'" />

    
  </div>
</template>
<script>
export default {
  data() {
    return {
      token: localStorage.getItem("token"),
     
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      let { data } = await this.axios.get('profile', {
        headers: { Authorization: 'Bearer ' + this.token }
      })

      if (data.status == "SUCCESS") {
        // redirect ke index
      } else {
        // ada validation form

        // jika tidak ada validation form, error global
      }
    }
  }
};
</script>
