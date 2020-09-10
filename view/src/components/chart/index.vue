<template>
  <!-- <div class="chart">
    <div id="sex" style="width: 40%;height:400px;"></div>
    <div id="age" style="width: 40%;height:400px;"></div>
  </div>-->
  <el-row>
    <el-col :span="12">
      <div id="sex" style="width: 100%;height:400px;"></div>
    </el-col>
    <el-col :span="12">
      <div id="age" style="width: 100%;height:400px;"></div>
    </el-col>
  </el-row>
</template>

<script>
import axios from "../../axios.js";
var echarts = require("echarts");
export default {
  data() {
    return {
      charts: {
        male: 0,
        female: 0,
        yourth: 0,
        middle: 0,
        middle_elderly: 0,
        elderly: 0
      }
    };
  },
  created() {},
  mounted() {
    var _this = this;

    var sex_Chart = echarts.init(document.getElementById("sex"), "light");
    var age_Chart = echarts.init(document.getElementById("age"), "light");
    axios
      .chart()
      .then(res => {
        _this.charts.male = res.data.male;
        _this.charts.female = res.data.female;
        _this.charts.yourth = res.data.yourth;
        _this.charts.middle = res.data.middle;
        _this.charts.middle_elderly = res.data.middle_elderly;
        _this.charts.elderly = res.data.elderly;
      })
      .then(() => {
        sex_Chart.setOption({
          title: {
            text: "i2员工数据统计",
            left: "right"
          },
          legend: {
            orient: "vertical",
            left: 10,
            top: 100
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: "性别比例",
              color: ["#67E0E3", "#9FE6B8"],
              type: "pie", // 设置图表类型为饼图
              radius: "55%", // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
              center: ["50%", "60%"],
              data: [
                // 数据数组，name 为数据项名称，value 为数据项值
                { value: _this.charts.male, name: "男性" },
                { value: _this.charts.female, name: "女性" }
              ]
            },
          ]
        }),
          age_Chart.setOption({
            legend: {
              orient: "vertical",
              left: 10,
              top: 100
            },
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
              {
                name: "年龄比例",
                color: ["#37A2DA", "#32C5E9", "#67E0E3", "#9FE6B8"],
                type: "pie", // 设置图表类型为饼图
                radius: "55%", // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                center: ["50%", "60%"],
                data: [
                  // 数据数组，name 为数据项名称，value 为数据项值
                  { value: _this.charts.yourth, name: "青年" },
                  { value: _this.charts.middle, name: "中年" },
                  { value: _this.charts.middle_elderly, name: "中老年" },
                  { value: _this.charts.elderly, name: "老年" }
                ]
              }
            ]
          });
      });
  }
};
</script>

    

<style scoped>
</style>