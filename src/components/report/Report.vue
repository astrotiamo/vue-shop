<template>
  <div>
    <!-- 导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 为ECharts准备一个具备大小(宽高)的Dom -->
      <div id="main" style="width: 750px;height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { request } from '../../network/request'
import _ from 'lodash'

export default {
  name: "Report",
  data() {
    return {
      // 需要合并的数据
      options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
    }
  },
  created() {

  },
  methods: {

  },
  // dom元素被渲染完毕
  async mounted() {
    // 基于准备好的Dom,初始化echarts实例
    var myCharts = echarts.init(document.getElementById('main'))

    const res = await request({
      url: 'reports/type/1',
      method: 'get'
    })
    if(res.data.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败！')
    }

    // 准备数据和配置项
    const result = _.merge(res.data.data, this.options)
    // var option = {
    //   title: {
    //     text: 'ECharts入门示例'
    //   },
    //   tooltip: {},
    //   legend: {
    //     data: ['销量']
    //   },
    //   xAxis: {
    //     data: ["衬衫", "羊毛衫", "裤子"]
    //   },
    //   yAxis: {},
    //   series: [{
    //     name: '销量',
    //     type: 'bar',
    //     data: [5, 20, 36, 10, 10, 20]
    //   }]
    // }

    // 展示数据
    myCharts.setOption(result)
  }
}
</script>

<style lang="less" scoped>

</style>