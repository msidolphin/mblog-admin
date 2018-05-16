<template>
  <el-menu
    background-color="rgba(238,238,238,0.98)"
    text-color="#333"
    active-text-color="#148cf1"
    :default-active="activePath"
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
  computed: {
    activePath () {
      // 解决编辑文章侧栏不会高亮的bug
      if ((this.$route.path && this.$route.path.indexOf('/blog/articles/list') !== -1) || window.location.href.indexOf('/blog/articles/list') !== -1) {
        return this.$route.path
      } else if ((this.$route.path && this.$route.path.indexOf('/blog/articles/recycle') !== -1) && window.location.href.indexOf('/blog/articles/recycle') !== -1) {
        return this.$route.path
      } else if ((this.$route.path && this.$route.path.indexOf('/blog/articles') !== -1) && window.location.href.indexOf('/blog/articles') !== -1) {
        return '/blog/articles'
      }
      return this.$route.path
    }
  }
}
</script>

<style lang="scss">

</style>
