<template>
  <!-- 背景图 -->
  <!-- 导航 -->
  <!-- 标题 -->
  <!-- 分类目录 -->
  <!-- 文章标签 -->
  <!-- 联系方式 -->
  <!-- ICP -->
  <!-- site -->
  <el-row>
    <el-col :span="24">
      <el-table></el-table>
    </el-col>
  </el-row>
</template>

<script>
  export default {
      name: "portal-content",
      data() {
        return {
          data: [
            {
              key: "bg-img",
              remark: '背景图',
              type: 'img',
              value: ''
            },
            {
              key: 'navbar1',
              remark: '首页',
              type: 'navbar',
              value: ''
            },
            {
              key: 'navbar2',
              remark: 'Java',
              type: 'navbar',
              value: ''
            },
            {
              key: 'navbar3',
              remark: 'Linux',
              type: 'navbar',
              value: ''
            },
            {
              key: 'navbar4',
              remark: 'CSS',
              type: 'navbar',
              value: ''
            },
            {
              key: 'navbar5',
              remark: 'JavaScript',
              type: 'navbar',
              value: ''
            },
          ]
        }
      }
  }
</script>

<style scoped>

</style>
