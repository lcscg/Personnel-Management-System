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
        <el-form-item label="联系电话">
          <el-input v-model="filters.phone" placeholder="请输入联系电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="filters.department" placeholder="请选择">
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="FindStaff(1)">查 询</el-button>
          <el-button type="primary" v-on:click="clear()">重 置</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>-->
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="staff" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="id" label="工号" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="150"></el-table-column>
      <el-table-column prop="sex" label="性别" width="150" :formatter="formatSex"></el-table-column>
      <el-table-column prop="job" label="岗位" width="150"></el-table-column>
      <el-table-column prop="department" label="所属部门" width="150"></el-table-column>
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
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="leave(scope.$index, scope.row)">离职</el-button>
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
    <el-dialog title="修改员工信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="工号" prop="id">
          <el-input v-model="editForm.id" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-select v-model="editForm.department" placeholder="请选择" @change="getPositions($event)">
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-select v-model.trim="editForm.job" placeholder="请选择">
            <el-option
              v-for="item in positions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" label="0">男</el-radio>
            <el-radio class="radio" label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="18" :max="65"></el-input-number>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="editForm.phone"
            auto-complete="off"
            minlength="11"
            maxlength="11"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="editForm.mail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editForm.addr"></el-input>
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
      staff: [],
      total: 0,
      positions: [],
      page: 1,
      pageNum: 1,
      listLoading: true,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            pattern: /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\.·。]{0,8}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,8}[a-zA-Z]{1}$)/,
            message: "请输入正确的姓名"
          }
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
            message: "请输入正确的手机号码"
          }
        ],
        mail: [
          // {
          //   pattern: /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
          //   message: "请输入正确的邮箱"
          // }
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        job: [
          { required: true, message: "请输入岗位", trigger: "blur" },
          {
            pattern: /^[a-z\u4e00-\u9fa5]+$/,
            message: "请输入正确的岗位名称"
          }
        ],
        department: [
          { required: true, message: "请输入所属部门", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: "",
        name: "",
        sex: 0,
        age: 0,
        addr: "",
        phone: "",
        mail: "",
        department: "",
        job: ""
      }
    };
  },
  methods: {
    //重置搜索栏
    clear() {
      this.filters.id = "";
      this.filters.name = "";
      this.filters.phone = "";
      this.filters.department = "";
      this.getUser();
    },
    formatter(row, col) {
      return moment(row.leafTime).format("YYYY-MM-DD");
    },
    //离职
    leave(index, row) {
      var _this = this;
      this.$prompt("", "员工离职", {
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "确定离职",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        cancelButtonClass: "transferPusherCancel",
        confirmButtonClass: "transferPusherConfirm",
        center: true,
        inputPlaceholder: "请输入离职原因",
        message:
          '<span style="color:red;font-weight:700;font-size:15px;position:relative;top:80px">--提醒：该操作不可逆，请谨慎操作。</span>'
      }).then(({ value }) => {
        if (value == "" || value == null) {
          this.$message({
            type: "warning",
            message: "请输入离职原因"
          });
        } else {
          var date = new Date();
          row.remark = value;
          row.status = "离职";
          row.leafTime = date;
          axios.updateStaff(row).then(res => {
            this.$message({
              type: "success",
              message: "成功离职"
            });
            _this.getUser();
          });
        }
      });
    },
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 0 ? "男" : row.sex == 1 ? "女" : "未知";
    },
    editSubmit(editForm) {
      var _this = this;
      console.log(_this.editForm);
      this.$refs[editForm].validate(valid => {
        if (valid) {
          axios.updateStaff(_this.editForm).then(res => {
            if (res.status == 200) {
              _this.$message({
                type: "success",
                message: "提交成功"
              });
              _this.getUser();
              _this.editFormVisible = false;
            } else {
              _this.$message({
                type: "error",
                message: "提交失败"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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
        status: "在职"
      };
      axios.findStaff(params).then(res => {
        _this.staff = res.data.result;
        _this.total = res.data.size;
      });
    },

    getUser() {
      let para = {
        pageNum: this.pageNum
        // pageSize: this.pageSize,
      };
      // this.loading = true;
      var _this = this;
      axios.pageStaff(para.pageNum).then(res => {
        if (res.status == 200) {
          _this.staff = res.data.result;
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
      else this.FindStaff(2);
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
    },
    getPositions(event) {
      var _this = this;
      _this.editForm.job = "";
      axios.findPosition({ department: event }).then(res => {
        _this.positions = [];
        let obj = res.data.result;
        obj.forEach((arr, index) => {
          _this.positions.push({ value: arr.position });
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
<style scoped>
</style>
