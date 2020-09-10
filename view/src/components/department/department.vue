<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="所属部门">
          <el-select v-model="filters.department" placeholder="请选择">
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="findDepart(1)">查 询</el-button>
          <el-button type="primary" v-on:click="clear()">重 置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="department" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="department" label="所属部门" width="200"></el-table-column>
      <el-table-column prop="department_function" label="部门职能" width="800"></el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    <el-dialog title="修改信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="部门" prop="department">
          <el-input v-model="editForm.department" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门职能" prop="department_function">
          <el-input v-model="editForm.department_function" type="textarea" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import axios from "../../axios.js";
export default {
  data() {
    return {
      filters: {
        department: ""
      },
      departments: [],
      department: [],
      total: 0,
      page: 1,
      pageNum: 1,
      listLoading: true,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {},
      //编辑界面数据
      editForm: {
        department: "",
        department_function: ""
      }
    };
  },
  methods: {
    //重置搜索栏
    clear() {
      this.filters.department = "";
      this.getData();
    },
    handleEdit(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    editSubmit(editForm) {
      var _this = this;
      this.$refs[editForm].validate(valid => {
        if (valid) {
          axios.updateDepartment(_this.editForm).then(res => {
            if (res.data.code == 200) {
              _this.$message({
                type: "success",
                message: "修改成功"
              });
              _this.getData();
              _this.editFormVisible = false;
            } else {
              _this.$message({
                type: "error",
                message: "修改失败"
              });
            }
          });
        }
      });
    },
    findDepart(num) {
      var number;
      num == 1 ? (number = 1) : (number = this.pageNum);
      var _this = this;
      var params = {
        department: _this.filters.department
      };
      axios.findDepart(params).then(res => {
        _this.department = res.data.result;
        _this.total = res.data.size;
      });
    },

    getData() {
      let para = {
        pageNum: this.pageNum
      };
      var _this = this;
      axios.pageDepartment(para.pageNum).then(res => {
        if (res.data.code == 200) {
          _this.department = res.data.result;
          _this.total = res.data.size;
          _this.listLoading=false
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
      if (this.filters.department == "") this.getData();
      else this.findDepart(2);
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
    this.getData();
  }
};
</script>
<style scoped>
</style>
