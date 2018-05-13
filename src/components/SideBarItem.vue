<template>
  <el-menu
    background-color="rgba(238,238,238,0.98)"
    text-color="#333"
    active-text-color="#148cf1"
    :default-active="path($route.path)"
    router :collapse="collapse" >
    <template v-for="item in routes">
      <!-- 注意：index是url -->
      <el-menu-item style="border-bottom: 1px solid #e5e5e5;" :index="item.path" v-if="!item.children || item.leaf || item.children.length === 0">
        <i :class="item.iconCls"></i>
        <span>{{ item.name }}</span>
      </el-menu-item>
      <sub-menu v-else :routes="item"/>
    </template>
  </el-menu>
</template>

<script>
import SubMenu from "./SubMenu";

export default {
  components: {SubMenu},
  name: "side-bar-item",
  props: ['routes'],
  data() {
    return {
      collapse: false
    }
  },
  methods: {
    path (path) {
      // 解决编辑文章侧栏不会高亮的bug
      if ((path && path.indexOf('/blog/articles/list')) || window.location.href.indexOf('/blog/articles/list')) return path
      else if ((path && path.indexOf('/blog/articles')) || window.location.href.indexOf('/blog/articles')) {
        return '/blog/articles'
      }
      return path
    }
  }
}
</script>

<style lang="scss">

</style>
