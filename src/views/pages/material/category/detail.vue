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
    <breadcumb :page="'Detail'" :folder="'Material Category'" />

    
  </div>
</template>

<script>
import axios from 'axios'

export default {
  metaInfo: {
    title: "Material Category",
  },
  data() {
    return {
     
    };
  }
};
</script>
