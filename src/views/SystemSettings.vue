<template>
  <el-row :gutter="10">
    <el-col :span="24">
      <el-col :span="24">
        <el-form :inline="true" class="form-inline">
          <el-form-item label="类型">
            <el-select v-model="settingsQuery.type" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="settingsQuery.name" placeholder="请输入名称"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 记录 -->
        <el-table :v-loading="loading" :data="data" :border="true" :height="700" :show-header="true" :highlight-current-row="true">
          <el-table-column width="180px" align="center" label="名称">
            <template slot-scope="scope">
              <span>{{scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="key" width="250px" align="center" label="KEY"></el-table-column>
          <el-table-column prop="value" width="600px" align="center" label="VALUE"></el-table-column>
          <el-table-column width="400px" align="center" label="预览" style="position: relative;text-align: center;">
            <template slot-scope="scope">
              <img v-if="scope.row.isImage" class="previewImg" :src="scope.row.value"/>
            </template>
          </el-table-column>
          <el-table-column width="108px" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="edit(scope.row, scope.$index)">编辑</el-button>
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
      title="系统设置"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <el-form ref="form"  label-width="80px">
        <el-form-item label="ID">
          <el-input v-model="formParam.id" ref="idInput" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="formParam.type" ref="typeInput" placeholder="请选择类型">
            <el-option label="前台" value="0"></el-option>
            <el-option label="后台" value="1"></el-option>
            <el-option label="公共" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片资源">
          <el-switch
            ref="imageInput"
            v-model="formParam.isImage"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否" >
          </el-switch>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="formParam.name" ref="nameInput" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="KEY">
          <el-input v-model="formParam.key" ref="keyInput" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="VALUE">
          <el-input v-model="formParam.value" ref="valueInput" placeholder="请输入键值"></el-input>
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
        typeValue: null,
        options: [
          {
            value: '0',
            label: '前台'
          },
          {
            value: '1',
            label: '后台'
          },
          {
            value: '2',
            label: '公共'
          }
        ],
        pageNum: 1,
        pageSize: 10,
        settingsQuery: {
          name: null,
          type: null
        },
        loading: true,
        //用于暂存标签的id和名称
        //这么做的原因是el-dialog组件默认一开始关闭的话是不存在于页面的，所以用this.$ref是无法获取到对话框内部的元素的
        //解决思路是监听对话框的open事件,打开的时候为内部输入框赋值
        formParam: {
          id: null,
          key: null,
          name: null,
          value: null,
          type: null,
          isImage: null
        },
        dialogVisible: false,
        index: null,
      }
    },
    methods: {
      //获取数据
      getData(page) {
        this.loading = true
        this.settingsQuery.name = this.settingsQuery.name ? this.settingsQuery.name.trim() : null
        api.fetchSettings({...this.settingsQuery, pageNum: page}).then(response => {
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
        if (!validate(formParam.id, 'required')) {tips('id不能为空', 'error'); return}
        if (!validate(formParam.type, 'required')) {tips('类型不能为空', 'error'); return}
        if (!validate(formParam.value, 'required')) {tips('键值不能为空', 'error'); return}
        if (!validate(formParam.name, 'required')) {tips('名称不能为空', 'error'); return}
        if (!validate(formParam.isImage, 'required')) {tips('是否为图像资源不能为空', 'error'); return}
        api.saveSetting({
          id: formParam.id,
          name: formParam.name,
          value: formParam.value,
          type: formParam.type,
          isImage: formParam.isImage
        }).then(response => {
          //重新渲染页面
          // this.data[this.index].name = this.currentName
          tips('保存成功', 'success')
          let data = response.data.data
          this.data[this.index].name = data.name
          this.data[this.index].id = data.id
          this.data[this.index].value = data.value
          this.data[this.index].type = data.type
          if(data.name.isImage === "0") {
            this.data[this.index].isImage = false
          }else if(data.name.isImage === "1") {
            this.data[this.index].isImage = true
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
