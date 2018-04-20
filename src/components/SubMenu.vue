<template>
  <el-submenu :index="routes.id" style="border-bottom: 1px solid #e5e5e5;">
      <template slot="title" >
        <i :class="routes.iconCls"></i>
        <span>{{ routes.name }}</span>
      </template>
      <template  v-for="subItem in routes.children" >
        <el-menu-item :index="subItem.path" v-if="!subItem.children || subItem.children.length === 0 || subItem.leaf">{{ subItem.name }}</el-menu-item>
        <sub-menu :routes="subItem" v-else/>
      </template>
  </el-submenu>
</template>

<script>
    export default {
      name: "sub-menu",
      props: ['routes']
    }
</script>

<style scoped>

</style>
