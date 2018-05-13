<template>
  <el-row class="warp">
    <!--<el-col :span="24" class="warp-breadcrum">-->
      <!--<el-breadcrumb separator="/">-->
        <!--<el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</el-col>-->
    <el-col :span="24" class="warp-main">
      <github-corner/>
      <div class="container">
        <div class="panel-group">
          <div class="panel-item">
            <panel :type="{background: '#6a8abe',boxShadow: '0 5px 0 #5f7cab'}" icon="iconfont my-icon-wenjian" title="文章">
              <count-up :start-val="0" :end-val="articleCount" :precision="0"/>
            </panel>
          </div>
          <div class="panel-item">
            <panel :type="{background: '#fc8675',boxShadow: '0 5px 0 #e27869'}" icon="iconfont my-icon-biaoqian" title="标签">
              <count-up :start-val="0" :end-val="tagCount" :precision="0"/>
            </panel>
          </div>
          <div class="panel-item">
            <panel :type="{background: '#5ab6df',boxShadow: '0 5px 0 #51a3c8'}" icon="iconfont my-icon-wode" title="用户">
              <count-up :start-val="0" :end-val="userCount" :precision="0"/>
            </panel>
          </div>
          <div class="panel-item">
            <panel :type="{background: '#4acacb',boxShadow: '0 5px 0 #42b5b6'}" icon="iconfont my-icon-pinglun" title="评论">
              <count-up :start-val="0" :end-val="commentCount" :precision="0"/>
            </panel>
          </div>
        </div>
        <div class="charts-wrapper">
          <!--<div id="dashboard-bar-charts" style="width:100%; height:100%"></div>-->
          <div id="hotArticle" style="width:50%;height:100%;display:inline-block;margin-right:10px;"></div>
          <div id="publishCharts" style="width:45%;height:100%;display:inline-block;"></div>
        </div>
      </div>
    </el-col>
  </el-row>

</template>
<style lang="scss">
  .container {
    .panel-group {
      .panel-item {
        display: inline-block;
        margin: 10px;
      }
    }
    .charts-wrapper {
      padding: 5px;
      margin-top: 30px;
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
  import CountUp from "../components/countUp";

  export default {
    components: {
      CountUp,
      GithubCorner, Panel, TodoList},
    data() {
      return {
        currentDate: new Date(),
        articleCount: 0,
        tagCount: 0,
        commentCount: 0,
        userCount: 0,
        barCharts: {},
        hotCharts: {},
        publishCharts: {},
      };
    },
    methods: {
      getData() {
        this.publishCharts.showLoading()
        this.hotCharts.showLoading()
        api.fetchDashboard().then(response => {
          let data = response.data.data
          let option = data.echartsData['dashboard-bar'].option
          let hottestData = data.echartsData['hottestArticles']
          this.commentCount = data.commentCount
          this.articleCount = data.articleCount
          this.tagCount = data.tagCount
          this.userCount = data.userCount
          let titleText = data.echartsData['dashboard-bar'].title.text
          this.initPublishECharts(option, titleText)
          this.initHottestArticlesCharts(hottestData)
        }).catch(()=>{
          tips("获取数据失败", 'error')
          this.publishCharts.hideLoading()
        })
      },
      initHottestArticlesCharts(data) {
        if (!data) {
          this.hotCharts.hideLoading()
          return
        }
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        var option = {
          color: colors,

          tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'cross'}
          },
          grid: {
            right: '20%'
          },
          toolbox: {
            feature: {
              // dataView: {show: true, readOnly: false},
              // restore: {show: true},
              // saveAsImage: {show: true}
            }
          },
          legend: {
            data:['点赞数','阅览数','评论数']
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              data: data.titles
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '点赞数',
              min: 0,
              minInterval: 1,
              position: 'right',
              axisLine: {
                lineStyle: {
                  color: colors[0]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '评论数',
              min: 0,
              minInterval: 1,
              position: 'right',
              offset: 80,
              axisLine: {
                lineStyle: {
                  color: colors[1]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '阅览数',
              min: 0,
              minInterval: 1,
              position: 'left',
              axisLine: {
                lineStyle: {
                  color: colors[2]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name:'点赞数',
              type:'bar',
              data: data.votes
            },
            {
              name:'评论数',
              type:'bar',
              yAxisIndex: 1,
              data: data.replies
            },
            {
              name:'阅览数',
              type:'line',
              yAxisIndex: 2,
              data: data.views
            }
          ]
        };
        this.hotCharts.setOption(option)
        this.hotCharts.hideLoading()
      },
      initPublishECharts(option, title) {
        option.xAxis = option.xaxis
        option.yAxis = option.yaxis
        var colors = {
          "原创": '#333399',
          "转载": '#6699ff',
          '翻译': '#993333'
        }
        //设置颜色
        option.series.forEach((item)=> {
          item.itemStyle = {
            normal: {
              color: colors[item.name]
            }
          }
        })
        extend(option, {
          title: {
            text: title
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
        })
        this.publishCharts.setOption(option)
        this.publishCharts.hideLoading()
      }
    },
    mounted: function () {
      this.publishCharts = echarts.init(document.querySelector("#publishCharts"))
      this.hotCharts = echarts.init(document.querySelector("#hotArticle"))
      this.getData()
    }
  }
</script>
