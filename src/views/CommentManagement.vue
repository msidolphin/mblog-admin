<template>
  <el-row>
    <el-col :span="24">
      <el-form :inline="true" class="form-inline">
        <el-form-item label="文章标题">
          <el-input v-model="commentQuery.title" placeholder="请输入文章标题"/>
        </el-form-item>
        <el-form-item label="评论人">
          <el-input v-model="commentQuery.username" placeholder="请输入评论人"/>
        </el-form-item>
        <el-form-item label="评论内容">
          <el-input v-model="commentQuery.content" placeholder="请输入评论内容"/>
        </el-form-item>
        <el-form-item label="评论时间">
          <el-date-picker
            v-model="commentQuery.startTime"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="请输入开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker
            v-model="commentQuery.endTime"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="请输入结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 记录 -->
      <el-table :v-loading="loading" :data="data" :border="true" :height="700" :show-header="true" :highlight-current-row="true">
        <el-table-column type="selection"></el-table-column>
        <el-table-column width="200px" align="center" prop="id" label="ID"></el-table-column>
        <el-table-column width="300px" align="center" label="文章标题">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              {{ scope.row.content }}
              <div slot="reference">{{scope.row.title}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="username" width="120px" align="center" label="评论人"></el-table-column>
        <el-table-column prop="email"  width="240px" align="left" label="邮箱"></el-table-column>
        <el-table-column width="180px" align="left" label="个人网站">
          <template slot-scope="scope">
            <span v-if="scope.row.website !== ''">{{scope.row.website}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" width="180px" align="center" label="评论时间"></el-table-column>
        <el-table-column label="状态" align="center"  width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="switch-wrapper">
              <el-switch
                style="display: block"
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用"
                @change="switchChange(scope.row.type, scope.row.id, scope.row.status)">
              </el-switch>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="pageNum"
        :page-size="pageSize"
        @current-change="getData"/>
      <!--</el-pagination>-->
    </el-col>
  </el-row>
</template>

<script>
  import api from '@/api'
  export default {
    name: "comments",
    data() {
      return {
        data: [],
        total: -1,
        pageNum: 1,
        pageSize: 10,
        commentQuery: {
          title: '',
          username: '',
          content: '',
          startTime: '',
          endTime: ''
        },
        loading: true
      }
    },
    methods: {
      //获取数据
      getData(page) {
        this.loading = true
        api.fetchComments({...this.commentQuery, pageNum: page}).then(response => {
          this.data = response.data.data.list
          this.pageNum = response.data.data.pageNum
          this.total = response.data.data.total
          this.pageSize = response.data.data.pageSize
          this.loading = false
        }).catch(error => {
          console.log(error)
        })
      },
      switchChange(type, id, status) {
        /*
         * type   0 - 评论 1 - 回复
         * id     评论或回复id
         * status 评论回复改变的状态 true or false
         */
        if(type == 0)
          api.updateCommentStatus(id, status ? 1 : 0)
        else if(type == 1)
          api.updateReplyStatus(id, status ? 1 : 0)
      },
      search() {
        this.getData(1)
      }
    },
    created() {
      this.getData(1)
    }
  }
</script>

<style scoped>
  .el-tag + .el-tag {
    margin: 0 2px;
  }
  .switch-wrapper {
    height: 40px;
    line-height: 40px;
    display: table-cell;
    vertical-align: middle;
  }
  .switch-wrapper .el-switch{
    margin: 0 auto;
  }
</style>
