<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="工号">
          <el-input v-model="filters.id" placeholder="请输入工号" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="filters.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="FindWage(1)">查 询</el-button>
          <el-button type="primary" v-on:click="clear()">重 置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="Export">导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="Wage" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="id" label="工号" width="200"></el-table-column>
      <el-table-column prop="name" label="姓名" width="200"></el-table-column>
      <el-table-column prop="job" label="职位" width="200"></el-table-column>
      <el-table-column prop="department" label="所属部门" width="200"></el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">工资单</el-button>
          <!-- <el-button type="primary" size="small" @click="leave(scope.$index, scope.row)">添加工资单</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!--页码-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :page-size="10"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>
    <!--编辑界面-->
    <el-dialog title="修改工资单" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="工号" prop="id">
          <el-input v-model="editForm.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-input v-model="editForm.department" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="position">
          <el-input v-model="editForm.position" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="基本工资" prop="basic_wage">
          <el-input v-model="editForm.basic_wage" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="岗位工资" prop="post_wage">
          <el-input v-model="editForm.post_wage" auto-complete="off" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="出勤天数" prop="attendance">
          <el-input-number v-model="editForm.attendance" :min="0" :max="31"></el-input-number>
        </el-form-item>
        <el-form-item label="是否全勤" prop="attendance">
          <el-radio v-model="editForm.radio" :label="true">是</el-radio>
          <el-radio v-model="editForm.radio" :label="false">否</el-radio>
        </el-form-item>-->
        <el-form-item label="全勤奖" prop="reward">
          <el-input v-model="editForm.reward" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="考勤扣款" prop="deduction">
          <el-input v-model="editForm.deduction"></el-input>
        </el-form-item>
        <el-form-item label="奖金" prop="bonus">
          <el-input v-model="editForm.bonus"></el-input>
        </el-form-item>
        <el-form-item label="社保扣款" prop="social_security">
          <el-input v-model="editForm.social_security"></el-input>
        </el-form-item>
        <el-form-item label="个人所得税" prop="tax">
          <el-input v-model="editForm.tax"></el-input>
        </el-form-item>
        <el-form-item label="工资合计" prop="wage">
          <el-input v-model="editForm.wage"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">关 闭</el-button>
        <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">更 新</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import axios from "../../axios.js";
import moment from "moment";
export default {
  data() {
    return {
      filters: {
        name: "",
        id: ""
      },
      Wage: [],
      total: 0,
      page: 1,
      pageNum: 1,
      path: "",
      listLoading: true,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {},
      //编辑界面数据
      editForm: {
        id: "",
        name: "",
        job: "",
        department: "",
        post_wage: null, //岗位工资
        basic_wage: null, //基本工资
        attendance: null, //出勤天数
        deduction: null, //考勤扣款
        reward: null, //全勤奖
        performance: null, //绩效工资
        wage: null, //总工资
        radio: true,
        social_security: null,
        tax: null,
        bonus: null
      }
    };
  },
  methods: {
    download(url, fileName) {
      let link = document.createElement("a"); //创建a标签
      link.style.display = "none"; //将a标签隐藏
      link.href = url; //给a标签添加下载链接
      link.setAttribute("download", fileName); // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
      document.body.appendChild(link);
      link.click(); //执行a标签
    },
    Export() {
      axios
        .exportPayroll()
        .then(res => {
          if (res.data.code == 200) {
            this.download(res.data.result, "工资单.xlsx");
          }
            this.path = {
            path: res.data.result
          };
        }).then(() => {
          axios.delXlsx(this.path).then(res => {});
        })
    },
    //重置搜索栏
    clear() {
      this.filters.id = "";
      this.filters.name = "";
      this.getData();
    },
    handleEdit(index, row) {
      var _this = this;
      var params = {
        _id: row._id,
        id: row.id,
        post_wage: row.post_wage,
        basic_wage: row.basic_wage,
        attendance: row.attendance
      };
      axios.findPayroll(params).then(res => {
        if (res.data.code == 200) {
          _this.editForm = res.data.result[0];
          _this.editFormVisible = true;
        } else if (res.data.code == 300) {
          _this.editFormVisible = true;
          row.reward = null;
          this.editForm = Object.assign({}, row);
        }
      });
    },
    editSubmit(editForm) {
      var _this = this;
      console.log(_this.editForm);
      this.$refs[editForm].validate(valid => {
        if (valid) {
          axios.updateWage(_this.editForm).then(res => {
            if (res.data.code == 200) {
              _this.$message({
                type: "success",
                message: res.data.msg
              });
              _this.getData();
              _this.editFormVisible = false;
            } else {
              _this.$message({
                type: "error",
                message: "保存失败"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    FindWage(num) {
      var number;
      num == 1 ? (number = 1) : (number = this.pageNum);
      var _this = this;
      var params = {
        pageNum: number,
        name: _this.filters.name,
        id: _this.filters.id
      };
      axios.findWage(params).then(res => {
        _this.Wage = res.data.result;
        _this.total = res.data.size;
      });
    },

    getData() {
      let para = {
        pageNum: this.pageNum
        // pageSize: this.pageSize,
      };
      // this.loading = true;
      var _this = this;
      axios.pageStaff(para.pageNum).then(res => {
        if (res.status == 200) {
          _this.Wage = res.data.result;
          _this.total = res.data.size;
          _this.listLoading = false;
        } else {
          this.$message({
            message: "错误",
            type: "error"
          });
        }
      });
    },
    // 改变时
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    //条目改变时
    handleCurrentChange(val) {
      this.pageNum = val;
      if (this.filters.name == "" && this.filters.id == "") this.getData();
      else this.FindWage(2);
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style scoped>
</style>
