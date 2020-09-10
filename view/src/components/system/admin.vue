<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="账号">
          <el-input v-model.trim="filters.name" placeholder="账号" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model.trim="filters.username" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model.trim="filters.phone" placeholder="请输入手机号码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="FindUser(1)">查 询</el-button>
          <el-button type="primary" v-on:click="clear()">重 置</el-button>
          <el-button type="primary" @click="handleAdd">新 增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="name" label="账号" width="120"></el-table-column>
      <el-table-column prop="password" label="密码" width="150"></el-table-column>
      <el-table-column prop="power" label="权限" width="150" :formatter="formatPower"></el-table-column>
      <el-table-column prop="username" label="姓名" width="150"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="180"></el-table-column>
      <el-table-column prop="mail" label="邮箱" width="180"></el-table-column>
      <!-- <el-table-column prop="time" label="最后登录时间" width="180" ></el-table-column> -->
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
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
    <!--编辑界面-->
    <el-dialog title="修改管理员" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="Form" label-width="80px" :rules="FormRules" ref="editForm">
        <el-form-item label="账号" prop="name">
          <el-input v-model.trim="Form.name" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model.trim="Form.password"
            auto-complete="off"
            show-password
            placeholder="请输入密码"
            clearable
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="权限" prop="power">
          <el-input v-model.trim="Form.power" auto-complete="off" clearable></el-input>
        </el-form-item>-->
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="Form.username" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model.trim="Form.phone"
            auto-complete="off"
            minlength="11"
            maxlength="11"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model.trim="Form.mail" auto-complete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提 交</el-button>
      </div>
    </el-dialog>
    <!--新增界面-->
    <el-dialog title="添加管理员" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="Form" label-width="80px" :rules="FormRules" ref="Form">
        <el-form-item label="账号" prop="name">
          <el-input v-model.trim="Form.name" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model.trim="Form.password"
            auto-complete="off"
            clearable
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="权限" prop="power">
          <el-input v-model.trim="Form.power" auto-complete="off" clearable></el-input>
        </el-form-item>-->
        <el-form-item label="姓名" prop="username">
          <el-input v-model.trim="Form.username" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model.trim="Form.phone"
            auto-complete="off"
            minlength="11"
            maxlength="11"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model.trim="Form.mail" auto-complete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="addSubmit('Form')" :loading="addLoading">提 交</el-button>
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
        name: "",
        username: "",
        phone: ""
      },
      users: [],
      total: 0,
      pageNum: 1,
      page: 1,
      listLoading: true,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      FormRules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            pattern: /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\.·。]{0,8}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,8}[a-zA-Z]{1}$)/,
            message: "请输入正确的姓名"
          }
        ],
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机电话", trigger: "blur" },
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
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
            message: "至少8个字符，必须包含1个字母，1个数字和1个特殊字符"
          }
        ]
        // power: [{ required: true, message: "请输入权限", trigger: "blur" }]
      },
      //编辑界面数据
      Form: {
        password: "",
        name: "",
        username: "",
        phone: "",
        mail: ""
        // power: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,

      dialogVisible: true
    };
  },
  methods: {
    // 改变时
    handleSizeChange(val) {
      this.pageSize = val;
      this.getdata();
    },
    //条目改变时
    handleCurrentChange(val) {
      this.pageNum = val;
      if (
        this.filters.name == "" &&
        this.filters.phone == "" &&
        this.filters.username == ""
      )
        this.getUser();
      else this.FindUser(2);
    },
    FindUser(num) {
      var number;
      num == 1 ? (number = 1) : (number = this.pageNum);
      var _this = this;
      var params = {
        name: _this.filters.name,
        username: _this.filters.username,
        phone: _this.filters.phone,
        pageNum: number
      };
      axios.findUser(params).then(res => {
        console.log(res.data);
        _this.users = res.data.result;
        _this.total = res.data.size;
      });
    },
    //重置搜索栏
    clear() {
      // this.filters.id = "";
      this.filters.name = "";
      this.filters.phone = "";
      this.filters.username = "";
      this.getdata();
    },
    getdata() {
      let para = {
        pageNum: this.pageNum
        // pageSize: this.pageSize,
      };
      // this.loading = true;
      var _this = this;
      console.log(para.pageNum);
      axios.pageUser(para.pageNum).then(res => {
        if (res.status == 200) {
          _this.users = res.data.result;
          _this.total = res.data.size;
          _this.listLoading = false;
          console.log("成功");
        } else {
          this.$message({
            message: "错误",
            type: "error"
          });
        }
      });
    },
    handleEdit(index, row) {
      this.editFormVisible = true;
      this.Form = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd() {
      this.addFormVisible = true;
      this.Form = {
        password: "",
        name: "",
        username: "",
        // power: "",
        phone: "",
        mail: ""
      };
    },
    formatPower(row, column) {
      return row.power == 0
        ? "普通管理员"
        : row.power == 1
        ? "超级管理员"
        : "未知";
    },
    editSubmit(Form) {
      var _this = this;
      this.$refs[Form].validate(valid => {
        if (valid) {
          axios.updateUser(_this.Form).then(res => {
            if (res.status == 200) {
              _this.$message({
                type: "success",
                message: "提交成功"
              });
              this.getdata();
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

    handleDel(row, col) {
      var _this = this;
      // console.log(col._id)
      if (col.power == 1) {
        _this.$message({
          type: "error",
          message: "超级管理员账号禁止删除"
        });
      } else {
        this.$confirm("确认删除吗?", "删除账号", {
          type: "warning"
        }).then(() => {
          axios.delUser({ id: col._id }).then(res => {
            if (res.status == 200) {
              _this.$message({
                type: "success",
                message: "删除成功"
              });
              _this.users.splice(row, 1);
              this.getdata();
            } else {
              _this.$message({
                type: "error",
                message: "删除失败"
              });
            }
          });
        });
      }
    },
    addSubmit(Form) {
      var _this = this;
      this.$refs[Form].validate(valid => {
        if (valid) {
          axios.addUser(_this.Form).then(res => {
            console.log(res);
            if (res.data.success == true) {
              _this.$message({
                type: "success",
                message: "添加成功"
              });
              _this.addFormVisible = false;
              this.getdata();
            } else if (res.data.success == false) {
              _this.$message({
                type: "error",
                message: "账号已存在"
              });
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
    }
  },
  created() {
    this.getdata();
  }
};
</script>
<style scoped>
</style>
