<template>
  <side-bar-item :routes="routes"/>
</template>

<script>
  import SideBarItem from "./SideBarItem";
  import routes from '@/mock/routes'
  export default {
    components: {SideBarItem},
    name: "side-bar",
    data() {
      return {
        routes
      }
    }
  }
</script>

<style scoped>

</style>
