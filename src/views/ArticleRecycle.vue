<template>
  <el-row>
    <el-col :span="24">
      <el-form :inline="true" class="form-inline">
        <el-form-item label="文章标题">
          <el-input placeholder="请输入文章标题" v-model="title"/>
        </el-form-item>
        <el-form-item label="标签">
          <div class="tags-wrap">
            <el-tag v-for="tag in tags" closable :key="tag" :type="tag" @close="delTag(tag)">{{ tag }}</el-tag>
            <el-input v-if="tagInputVisible" size="small" ref="tagInput" class="tag-input" v-model="newTag" @blur="addTag" @keyup.enter.navtive="addTag"></el-input>
            <el-button v-else icon="el-icon-circle-plus" type="text" size="mini" @click="showTagInput"/>
          </div>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="请输入开始时间" v-model="startTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="请输入结束时间" v-model="endTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 记录 -->
      <el-table :data="data" :border="true" :height="800" :show-header="true" :highlight-current-row="true">
        <!--<el-table-column width="40px" type="selection"></el-table-column>-->
        <el-table-column width="185px" align="center" prop="id" label="ID"></el-table-column>
        <el-table-column prop="title" align="center" label="文章标题"></el-table-column>
        <el-table-column prop="author" width="120px" align="center" label="作者"></el-table-column>
        <el-table-column min-width="150px" label="文章标签">
          <template slot-scope="scope">
            <el-tag v-for="tag in scope.row.tags.split(',')" v-if="scope.row.tags" :key="tag">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="recover(scope.row.id)">恢复</el-button>
            <el-button size="mini" type="danger" @click="deleteArticle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageInfo.total"
        :page-size="pageInfo.pageSize"
        @current-change="getData">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
  import types from '@/store/types'
  import {tips} from '@/utils/utils'
  import api from '@/api'
  export default {
    name: "article-list",
    data() {
      return {
        newTag: '',
        tagInputVisible: false,
        data: [],
        pageInfo: {pages: 0},
        //查询参数
        tags: [],
        title: '',
        startTime: '',
        endTime: '',
        pageNum: 1
      }
    },
    methods: {
      search() {
        var params = {
          title     : this.title ? this.title : null,
          startTime : this.startTime ? this.startTime : null,
          endTime   : this.endTime ? this.endTime : null,
          tags      : this.tags.join(","),
          pageNum   : this.pageNum > 0 ? this.pageNum : 1,
          isDelete  : 1,
        }
        //保存查询参数
        this.$store.dispatch(types.SET_QUERY_PARAMS, params)

        this.$http.$request('/admin/articles', 'get', params).then(response => {
          const data = response.data.data
          if(data) {
            this.data = data.list
            this.pageInfo = data
            this.pageNum = this.pageInfo.pageNum
          }
        })
      },
      addTag() {
        let inputValue = this.newTag
        if(inputValue && this.tags.length < 5) {
          //新增标签
          this.tags.push(inputValue)
        }
        this.newTag = ''
        this.tagInputVisible = false
      },
      delTag(tag) {
        //从标签列表中移除一个标签
        this.tags.splice(this.tags.indexOf(tag), 1)
      },
      showTagInput() {
        if(this.tags.length < 5) {
          this.tagInputVisible = true
        }else {
          this.tagInputVisible = false
        }
      },
      //获取数据
      getData(page) {
        this.$http.$request('/admin/articles','get',{pageNum: page, isDelete: 1}).then(response => {
          const data = response.data.data
          if(data) {
            this.data = data.list
            this.pageInfo = data
            this.pageNum = this.pageInfo.pageNum
            this.pageSize = data.pages
          }
        })
      },
      recover(id) {
        if(id) {
          api.recoverArticle(id).then(() => {
            tips('文章已成功恢复', 'success')
            this.getData(this.pageNum)
          }).catch(error => {
            tips('恢复失败', 'error')
          })
        }
      },
      //删除文章
      deleteArticle(id) {
        if(id) {
          api.physicalDeleteArticle(id).then(() => {
            tips('文章删除成功', 'success')
            this.getData(this.pageNum)
          }).catch(error => {
            tips('文章删除失败', 'error')
          })
        }
      }
    },
    mounted() {
      this.getData(1)
    }
  }
</script>

<style scoped>
  .el-tag + .el-tag {
    margin: 0 2px;
  }
  .tag-input {
    width: 80px;
  }
</style>
