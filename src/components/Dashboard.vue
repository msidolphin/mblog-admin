<template>
  <el-row class="warp">
    <!--<el-col :span="24" class="warp-breadcrum">-->
      <!--<el-breadcrumb separator="/">-->
        <!--<el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</el-col>-->
    <el-col :span="24" class="warp-main">
      <github-corner/>
      <div class="left-side">
        <div class="panel-group">
          <div class="panel-item">
            <panel :type="{background: '#6a8abe',boxShadow: '0 5px 0 #5f7cab'}" icon="fa fa-newspaper-o" title="文章" :value="articleCount"/>
          </div>
          <div class="panel-item">
            <panel :type="{background: '#fc8675',boxShadow: '0 5px 0 #e27869'}" icon="fa fa-tag" title="标签" :value="tagCount"/>
          </div>
          <div class="panel-item">
            <panel :type="{background: '#5ab6df',boxShadow: '0 5px 0 #51a3c8'}" icon="fa fa-user" title="用户" :value="userCount"/>
          </div>
          <div class="panel-item">
            <panel :type="{background: '#4acacb',boxShadow: '0 5px 0 #42b5b6'}" icon="fa fa-commenting-o" title="评论" :value="commentCount"/>
          </div>
        </div>
        <div class="charts-wrapper">
          <div id="dashboard-bar-charts" style="width:100%; height:100%"></div>
        </div>
      </div>
      <div class="right-side">
        <todo-list/>
      </div>
    </el-col>
  </el-row>

</template>
<style lang="scss">
  .left-side {
    float: left;
    width: 56%;
    .panel-group {
      .panel-item {
        display: inline-block;
        margin: 10px;
      }
    }
    .charts-wrapper {
      padding: 5px;
      padding-top: 30px;
      width: 95%;
      height: 500px;
      display: block;
    }
  }

  .right-side {
    float: left;
    width: 35%;
  }

  .chart-container .el-col {
    padding: 30px 20px;
  }
</style>

<script>
  import echarts from 'echarts'
  import GithubCorner from '@/components/Github-corner'
  import Panel from '@/components/Panel'
  import TodoList from '@/components/TodoList'
  import api from '@/api'
  import {tips, extend} from '@/utils/utils'

  export default {
    components: {GithubCorner, Panel, TodoList},
    data() {
      return {
        currentDate: new Date(),
        articleCount: 0,
        tagCount: 0,
        commentCount: 0,
        userCount: 0,
        barCharts: {}
      };
    },
    methods: {
      getData() {
        this.barCharts.showLoading()
        api.fetchDashboard().then(response => {
          let data = response.data.data
          let option = data.echartsData['dashboard-bar'].option
          this.commentCount = data.commentCount
          this.articleCount = data.articleCount
          this.tagCount = data.tagCount
          this.userCount = data.userCount

          option.xAxis = option.xaxis
          option.yAxis = option.yaxis
          extend(option, {
            title: {
              text: data.echartsData['dashboard-bar'].title.text
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
          })
          this.barCharts.setOption(option)
          this.barCharts.hideLoading()
        }).catch(error => {
          tips('获取数据失败', 'error')
          this.barCharts.hideLoading()
        })

      },
    },
    mounted: function () {
      this.barCharts = echarts.init(document.querySelector("#dashboard-bar-charts"));
      this.getData();
    }
  }
</script>
