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
        api.fetchDashboard().then(response => {
          let data = response.data.data
          let option = data.echartsData['dashboard-bar'].option
          this.commentCount = data.commentCount
          this.articleCount = data.articleCount
          this.tagCount = data.tagCount
          this.userCount = data.userCount
          let titleText = data.echartsData['dashboard-bar'].title.text
          this.initPublishECharts(option, titleText)
        }).catch(()=>{
          tips("获取数据失败", 'error')
          this.publishCharts.hideLoading()
        })
      },
      initCharts() {
        this.hotCharts  = echarts.init(document.querySelector("#hotArticle"))
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
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
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
              data: ['测试文章1','测试文章2','测试文章3','测试文章4','测试文章5','测试文章6','测试文章7','测试文章8',
                '测试文章9','测试文章10']
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '评论数',
              min: 0,
              max: 250,
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
              name: '点赞数',
              min: 0,
              max: 250,
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
              max: 1000,
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
              data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0]
            },
            {
              name:'评论数',
              type:'bar',
              yAxisIndex: 1,
              data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8]
            },
            {
              name:'阅览数',
              type:'line',
              yAxisIndex: 2,
              data:[524, 421, 210, 987, 457, 786, 697, 888, 358, 127]
            }
          ]
        };
        this.hotCharts.setOption(option)
      },
      initPublishCharts() {
        this.publishCharts = echarts.init(document.querySelector("#publishCharts"))
        var option = {
          title: {
            text: '2018年文章发布情况统计图',
          },
          backgroundColor:'#ffffff',
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['原创','转载', '翻译']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis:  {
            type: 'value'
          },
          yAxis: {
            name: '月份',
            type: 'category',
            data: ['一',
              '二',
              '三',
              '四',
              '五',
              '六',
              '七',
              '八',
              '九',
              '十',
              '十一',
              '十二']
          },
          series: [
            {
              name: '原创',
              type: 'bar',
              stack: '数量',
              itemStyle:{normal:{color:'#333399'}},
              data: [492, 831, 731, 389, 738, 849, 822,712,732,754,934,1002]
            },
            {
              name: '转载',
              type: 'bar',
              stack: '数量',
              itemStyle:{normal:{color:'#6699ff'}},
              data: [40,50,51,61 ,62,66 ,67, 70 , 70, 72, 82, 94]
            },
            {
              name: '翻译',
              type: 'bar',
              stack: '数量',
              itemStyle:{normal:{color:'#993333'}},
              data: [219,221,230, 234,239,248,251, 261, 268, 271 , 288,300]
            }
          ]
        };
        this.publishCharts.setOption(option)
        this.publishCharts.hideLoading()
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
      // this.barCharts = echarts.init(document.querySelector("#dashboard-bar-charts"));
      this.publishCharts = echarts.init(document.querySelector("#publishCharts"))
      this.getData()
      this.initCharts()
      //this.initPublishCharts()
    }
  }
</script>
