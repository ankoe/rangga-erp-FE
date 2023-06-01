<template>
  <div class="main-content">
    <breadcumb :page="'Detail'" :folder="'Profile'" />

    <b-card class="wrapper">

      <b-card-header>
        <b-row>
          <b-col lg="3" offset-lg="9" class="mt-auto">
            <router-link :to="{ name: 'profile-password' }" class="btn btn-info btn-sm mb-3">
              Change Password
            </router-link>
            <router-link :to="{ name: 'profile-edit' }" class="btn btn-info btn-sm mb-3 ml-lg-2">
              Profile Edit
            </router-link>
          </b-col>
        </b-row>
      </b-card-header>

      <table class="table table-striped">
        <tbody>
          <tr>
            <td>Name</td>
            <td class="font-weight-bold">{{ name }}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td class="font-weight-bold">{{ email }}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td class="font-weight-bold">{{ mobile ? mobile : '-' }}</td>
          </tr>
          <tr>
            <td>Register Date</td>
            <td class="font-weight-bold">{{ createdAt | luxon }}</td>
          </tr>
          <tr>
            <td>Confirm Date</td>
            <td class="font-weight-bold">
              <span v-if="confirmedAt">{{ confirmedAt | luxon }}</span>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </b-card>


  </div>
</template>
<script>
export default {
  data() {
    return {
      name: null,
      email: null,
      mobile: null,
      createdAt: null,
      confirmedAt: null,
      imageProfile: null,
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      let { data } = await this.axios.get('profile')

      if (data.status == "SUCCESS") {
        this.name = data.data.name
        this.email = data.data.email
        this.mobile = data.data.mobile
        this.createdAt = data.data.created_at
        this.confirmedAt = data.data.confirmed_at
        this.imageProfile = data.data.image_profile
      } else {
        alert(data.message)
      }
    }
  }
};
</script>
