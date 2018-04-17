<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">系统权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户组管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="custom-tree-container">
          <div class="block">
            <p>用户组 <el-button type="success" @click="addGroup">新增根用户组</el-button></p>

            <el-tree
              :data="data4"
              class="filter-tree"
              node-key="id"
              :expand-on-click-node="false"
              :render-content="renderContent">
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="" style="padding: 20px;" >
          <!-- 查询条件 -->
          <div class="demo-input-suffix" style="margin-bottom: 10px;">
            <el-input
              style="width:200px;"
              placeholder="请输入姓名"
              suffix-icon="el-icon-date"
              v-model="input2">
            </el-input>
            <el-input
              style="width:200px;"
              placeholder="请输入所属用户组"
              prefix-icon="el-icon-search"
              v-model="input21">
            </el-input>
            <el-input
              style="width:200px;"
              placeholder="请输入邮箱"
              prefix-icon="el-icon-search"
              v-model="input21">
            </el-input>
            <el-input
              style="width:150px;"
              placeholder="请输入电话"
              prefix-icon="el-icon-search"
              v-model="input21">
            </el-input>
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
          </div>

          <el-table
            :data="tableData"
            border="true"
            highlight-current-row="true"
            style="width: 100%; margin-bottom: 10px;min-height: 600px;">
            <el-table-column
              label="姓名"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="所属用户组"
              width="180">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>姓名: {{ scope.row.name }}</p>
                  <p>住址: {{ scope.row.address }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="邮箱">
              <template slot-scope="scope">
                {{ scope.row.email }}
              </template>
            </el-table-column>
            <el-table-column label="电话">
              <template slot-scope="scope">
                {{ scope.row.phone }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="value3"
                  active-text="启用"
                  inactive-text="冻结">
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="新增用户组" :visible.sync="dialogVisible">
      <el-form>
        <el-form-item label="所属用户组"  label-width="120px">
          <el-input  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" label-width="120px">
          <el-input  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序号" label-width="120px">
          <el-input  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input  auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="活动区域" label-width="120px">-->
          <!--<el-select placeholder="请选择活动区域">-->
            <!--<el-option label="区域一" value="shanghai"></el-option>-->
            <!--<el-option label="区域二" value="beijing"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGroup">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
  let id = 1000;

  export default {
    data() {
      const data = [{
        id: 1,
        label: '技术部',
        children: [{
          id: 4,
          label: '后端开发',
          children: [{
            id: 9,
            label: 'Java'
          }, {
            id: 10,
            label: 'PHP'
          }]
        }]
      }, {
        id: 2,
        label: '财务部',
        children: [{
          id: 5,
          label: '不了解'
        }, {
          id: 6,
          label: '不了解2'
        }]
      }, {
        id: 3,
        label: '董事会',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      },{
        id: 3,
        label: '董事会',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      },{
        id: 3,
        label: '董事会',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      },{
        id: 3,
        label: '董事会',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      },{
        id: 3,
        label: '董事会',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      },{
        id: 3,
        label: '董事会',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      },{
        id: 3,
        label: '董事会',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      },{
        id: 3,
        label: '董事会',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }
      ];
      return {
        value3: true,
        dialogVisible: false,
        data4: JSON.parse(JSON.stringify(data)),
        data5: JSON.parse(JSON.stringify(data)),
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            email: '1226771922@qq.com',
            phone: '15363393934'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
            email: '1226771922@qq.com',
            phone: '15363393934'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
            email: '1226771922@qq.com',
            phone: '15363393934'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            email: '1226771922@qq.com',
            phone: '15363393934'
          }]
        }
      },
    methods: {
      addGroup() {
        this.dialogVisible = !this.dialogVisible
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
          <el-button size="mini" type="text" icon="el-icon-edit" on-click={ () => this.append(data) }/>
          <el-button size="mini" type="text" icon="el-icon-delete" on-click={ () => this.remove(node, data)}/>
          </span>
        </span>);
      }
    }
  };
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    /*width: 100px;*/
    /*margin: 20px auto;*/
    /*padding-right: 8px;*/
    /*padding-top: 10px;*/
    /*padding-bottom: 5px;*/
  }

</style>
