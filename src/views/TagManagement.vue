<template>
  <el-row :gutter="10">
    <el-col :span="24">
      <el-col :span="12">
        <el-form :inline="true" class="form-inline">
          <el-form-item label="标签名">
            <el-input v-model="tagsQuery.name" placeholder="请输入标签名"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 记录 -->
        <el-table :v-loading="loading" :data="data" :border="true" :height="700" :show-header="true" :highlight-current-row="true">
          <el-table-column width="210px" align="center" prop="id" label="ID"/>
          <el-table-column width="180px" align="center" label="标签名">
            <template slot-scope="scope">
              <span>{{scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="frequency" width="131px" align="center" label="引用次数"></el-table-column>
          <el-table-column prop="createTime"  width="220px" align="center" label="创建时间"></el-table-column>
          <el-table-column width="108px" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="edit(scope.row.id, scope.row.name, scope.$index)">编辑</el-button>
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
      title="编辑标签"
      :visible.sync="dialogVisible"
      width="30%"
      @open="hasOpen"
      center>
        <el-input ref="tagEditInput" v-model="currentName" placeholder="请输入标签名"/>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="save" >确 定</el-button>
    <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
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
        tagsQuery: {
          name: null
        },
        loading: true,
        dialogVisible: false,
        index: null,
        //用于暂存标签的id和名称
        //这么做的原因是el-dialog组件默认一开始关闭的话是不存在于页面的，所以用this.$ref是无法获取到对话框内部的元素的
        //解决思路是监听对话框的open事件,打开的时候为内部输入框赋值
        id: null,
        name: null,
        currentName: null
      }
    },
    methods: {
      //获取数据
      getData(page) {
        this.loading = true
        this.tagsQuery.name = this.tagsQuery.name ? this.tagsQuery.name.trim() : null
        api.fetchTags({...this.tagsQuery, pageNum: page}).then(response => {
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
      //保存标签
      save() {
        if(this.id && this.currentName && this.currentName !== this.name) {
          api.saveTag({
            id    : this.id,
            name  : this.currentName
          }).then(response => {
            console.log(response)
            //重新渲染页面
            this.data[this.index].name = this.currentName

            tips('保存成功', 'success')
          }).catch(error => {
            console.log(error)
          })
        }else if(!this.id) {

        }else if(!this.currentName){
          tips('标签名不能为空', 'error')
        }else {

        }
      },
      edit(id, name, index) {
        //打开对话框
        this.dialogVisible = true
        this.id = id
        this.name = name
        this.index = index
      },
      hasOpen() {
        //发现这么做还是不行...第一次this.$refs.tagEditInput获取的一直是undefined
        //应该是element-ui 对话框中的组件不是和对话框一起渲染出来的 采用土办法setTimeout...
        setTimeout(()=>{
          this.$refs.tagEditInput.$refs.input.value = this.name
        }, 1) //1ms 暂时是可以的
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
</style>
