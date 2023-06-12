<template>
  <div>
    <!-- <keep-alive> -->
    <component is="vertical-sidebar"></component>
    <!-- available layouts -->
    <!-- 
large-sidebar
vertical-sidebar
compact-sidebar


    -->
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getThemeMode"]),
  },
  methods: {},
};
</script>
