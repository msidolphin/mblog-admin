<template>
  <el-row :gutter="10">
    <el-col :span="24">
      <el-col :span="20">
        <el-form :inline="true" class="form-inline">
          <el-form-item label="名称">
            <el-input v-model="linkQuery.name" placeholder="请输入名称"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="success" @click="add">新增</el-button>
          </el-form-item>
        </el-form>
        <!-- 记录 -->
        <el-table :v-loading="loading" :data="data" :border="true" :height="700" :show-header="true" :highlight-current-row="true">
          <el-table-column width="250px" align="center" label="名称">
            <template slot-scope="scope">
              <span>{{scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="url" width="500px" align="center" label="URL"></el-table-column>
          <el-table-column prop="sort" sortable width="150px" align="center" label="排序号"></el-table-column>
          <el-table-column prop="createTime" sortable width="200px" align="center" label="创建时间"></el-table-column>
          <el-table-column width="250px" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="edit(scope.row, scope.$index)">编辑</el-button>
              <el-button type="danger"  @click="deleteLink(scope.row.id)">删除</el-button>
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
      </el-col>
      <el-col :span="12">

      </el-col>

      <!--</el-pagination>-->
    </el-col>
    <el-dialog
      :title="'友情链接' + ' > ' + subTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="form"  label-width="80px">
        <el-form-item v-if="isEdit"  label="ID">
          <el-input v-model="formParam.id"  :disabled="true"/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="formParam.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="formParam.url" placeholder="请输入URL"/>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="formParam.sort" controls-position="right"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save(formParam)">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script>
  import api from '@/api'
  import {tips, validate} from '@/utils/utils'
  import echarts from 'echarts'
  export default {
    name: "comments",
    data() {
      return {
        data: [],
        total: -1,
        pageNum: 1,
        pageSize: 10,
        linkQuery: {
          name: null
        },
        loading: true,
        //用于暂存标签的id和名称
        //这么做的原因是el-dialog组件默认一开始关闭的话是不存在于页面的，所以用this.$ref是无法获取到对话框内部的元素的
        //解决思路是监听对话框的open事件,打开的时候为内部输入框赋值
        formParam: {
          id: null,
          name: null,
          url: null,
          sort: null
        },
        dialogVisible: false,
        subTitle: '新增',
        isEdit: false,
        index: null,
      }
    },
    methods: {
      //获取数据
      getData(page) {
        this.loading = true
        this.linkQuery.name = this.linkQuery.name ? this.linkQuery.name.trim() : null
        api.fetchLinks({...this.linkQuery, pageNum: page}).then(response => {
          let data = response.data.data
          this.data = data.list
          this.pageSize = data.pageSize
          this.pageNum = data.pageNum
          this.total = data.total
        }).catch(error => {
          //TODO
        })
      },
      search() {
        this.getData(1)
      },
      //保存
      save(formParam) {
        //校验
        if (this.isEdit) {
          if (!validate(formParam.id, 'required')) {tips('id不能为空', 'error'); return}
        }
        //
        if (!validate(formParam.name, 'required')) {tips('链接名称不能为空', 'error'); return}
        if (!validate(formParam.url, 'required')) {tips('链接URL不能为空', 'error'); return}
        if (!validate(formParam.sort, 'required')) {tips('链接排序号不能为空', 'error'); return}
        api.saveLink({
          id: formParam.id,
          name: formParam.name,
          url: formParam.url,
          sort: formParam.sort
        }).then(response => {
          //重新渲染页面
          // this.data[this.index].name = this.currentName
          tips('保存成功', 'success')
          let data = response.data.data
          if(this.isEdit) {
            this.data[this.index].id = data.id
            this.data[this.index].name = data.name
            this.data[this.index].url = data.url
            this.data[this.index].sort = data.sort
          }else {
            this.getData(this.pageNum)
            this.dialogVisible = false
          }
        }).catch(error => {
          tips('保存失败', 'error')
        })
      },
      edit(param, index) {
        //打开对话框
        this.dialogVisible = true
        for(let key in param) {
          this.formParam[key] = param[key]
        }
        this.index = index
        this.isEdit = true
        this.subTitle = '编辑'
      },
      add() {
        this.isEdit = false
        this.dialogVisible = true
        this.subTitle = '新增'
      },
      deleteLink(id) {
        console.log(id)
        if(id) {
          api.deleteLink(id).then(response => {
            this.getData(this.pageNum)
          }).catch(error => {
            tips('删除失败', 'error')
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
  .switch-wrapper {
    height: 40px;
    line-height: 40px;
    display: table-cell;
    vertical-align: middle;
  }
  .switch-wrapper .el-switch{
    margin: 0 auto;
  }
  .previewImg {
    position: absolute;
    width: 90%;
    height: 90%;
    top:5%;
    bottom: 5%;
    left: 5%;
    right: 5%;
  }
</style>
