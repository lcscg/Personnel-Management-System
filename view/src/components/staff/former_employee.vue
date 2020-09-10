<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="工号">
          <el-input v-model.trim="filters.id" placeholder="请输入工号" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model.trim="filters.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model.trim="filters.phone" placeholder="请输入联系电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model.trim="filters.department" placeholder="请选择">
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="FindStaff(1)">查询</el-button>
          <el-button type="primary" v-on:click="clear()">重置</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>-->
      </el-form>
    </el-col>
    <!--列表-->
    <el-table
      :data="leave_staff"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%;"
    >
      <el-table-column prop="id" label="工号" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150"></el-table-column>
      <el-table-column prop="sex" label="性别" width="150" :formatter="formatSex"></el-table-column>
      <el-table-column prop="job" label="岗位" width="150"></el-table-column>
      <el-table-column prop="department" label="所属部门" width="150"></el-table-column>
      <el-table-column prop="leafTime" label="离职时间" width="150" :formatter="formatter"></el-table-column>
      <el-table-column prop="remark" label="离职原因" width="280"></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="180"></el-table-column>
      <el-table-column prop="mail" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="addr" label="地址" width="280"></el-table-column>
      <el-table-column prop="status" label="状态" width="150"></el-table-column>
      <el-table-column prop="age" label="年龄" width="150"></el-table-column>
      <el-table-column prop="birth_addr" label="户籍所在地" width="150"></el-table-column>
      <el-table-column prop="education" label="学历" width="150"></el-table-column>
      <el-table-column prop="contact" label="紧急联系人" width="150"></el-table-column>
      <el-table-column prop="contact_phone" label="紧急联系人电话" width="150"></el-table-column>
      <el-table-column prop="contact_relationship" label="紧急联系人关系" width="150"></el-table-column>
      <el-table-column prop="marriage" label="婚姻状况" width="150"></el-table-column>
      <el-table-column prop="create_time" label="入职时间" width="150" :formatter="formatter"></el-table-column>
    </el-table>
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
        id: "",
        department: "",
        phone: ""
      },
      departments: [],
      total: 0,
      page: 1,
      pageNum: 1,
      leave_staff: [],
      listLoading: true
    };
  },
  methods: {
    formatter(row, col) {
      return moment(row.leafTime).format("YYYY-MM-DD");
    },
    //重置
    clear() {
      this.filters.id = "";
      this.filters.name = "";
      this.filters.phone = "";
      this.filters.department = "";
      this.getUser();
    },
    //查找员工
    FindStaff(num) {
      var number;
      num == 1 ? (number = 1) : (number = this.pageNum);
      var _this = this;
      var params = {
        pageNum: number,
        name: _this.filters.name,
        id: _this.filters.id,
        phone: _this.filters.phone,
        department: _this.filters.department,
        status: "离职"
      };
      axios.findStaff(params).then(res => {
        console.log(res);

        _this.leave_staff = res.data.result;
        // res.data.result.length == undefined
        //   ? (_this.leave_staff = [res.data.result])
        //   : (_this.leave_staff = res.data.result);
        _this.total = res.data.size;
      });
    },
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 0 ? "男" : row.sex == 1 ? "女" : "未知";
    },
    //获取员工数据
    getUser() {
      let para = {
        pageNum: this.pageNum
        // pageSize: this.pageSize,
      };
      // this.loading = true;
      var _this = this;
      console.log(para.pageNum);
      axios.pageStaff_leave(para.pageNum).then(res => {
        if (res.status == 200) {
          _this.leave_staff = res.data.result;
          _this.total = res.data.size;
          console.log("成功");
          this.listLoading = false;
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
      this.getUser();
    },
    //条目改变时
    handleCurrentChange(val) {
      this.pageNum = val;
      if (
        this.filters.name == "" &&
        this.filters.id == "" &&
        this.filters.department == "" &&
        this.filters.phone == ""
      )
        this.getUser();
      else this.FindStaff();
    },
    //获取部门
    getDepartment() {
      var _this = this;
      axios.findDepartment().then(res => {
        let obj = res.data.result;
        obj.forEach((arr, index) => {
          _this.departments.push({ value: arr.department });
        });
      });
    }
  },
  mounted() {
    this.getDepartment();
  },
  created() {
    this.getUser();
  }
};
</script>

<style>
</style>