<template >
  <el-tabs v-model="activeName">
    <el-form
      class="login-container"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0px"
    >
      <h3 class="login_title">系统登录</h3>
      <el-form-item>
        <el-input
          prop="name"
          name="name"
          type="text"
          v-model="ruleForm.name"
          auto-complete="off"
          placeholder="账号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          prop="pass"
          name="pass"
          type="password"
          show-password
          v-model="ruleForm.pass"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="submitForm('ruleForm')"
        ></el-input>
      </el-form-item>
      <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%" @click="submitForm('ruleForm')">登 录</el-button>
      </el-form-item>
    </el-form>
  </el-tabs>
</template>
<script>
import axios from "../axios.js";
import store from "../store/index";
import Vue from "vue";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      activeName: "first",
      checked: false,
      // isChecked: true,
      ruleForm: {
        name: "",
        pass: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入您的名称", trigger: "blur" },
          { min: 6, max: 16, message: "长度在6 到 16 个字符", trigger: "blur" }
        ],
        pass: [{ required: true, validator: validatePass, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 设置Cookie
    setCookie(name, password, exdays) {
      // 用户名, 密码, 保存天数
      const exdate = new Date(); // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
      // 字符串拼接cookie
      window.document.cookie =
        "name=" + name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "pass=" + password + ";path=/;expires=" + exdate.toGMTString();
    },
    // 读取Cookie
    getCookie() {
      if (document.cookie.length > 0) {
        const arr = document.cookie.split("; "); // 这里显示的格式需要切割一下自己可输出看下
        for (let i = 0; i < arr.length; i++) {
          const arr2 = arr[i].split("="); // 再次切割
          // 判断查找相对应的值
          if (arr2[0] === "name") {
            this.ruleForm.name = arr2[1]; // 保存到保存数据的地方
          } else if (arr2[0] === "pass") {
            this.ruleForm.pass = arr2[1];
          }
          this.checked = true;
        }
      }
    },
    // 清除Cookie
    clearCookie() {
      this.setCookie("", "", -1); // 修改2值都为空，天数为负1天就好了
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (this.ruleForm.name == "") {
          this.$message({
            type: "warning",
            message: "请输入账号"
          });
        } else if (this.ruleForm.pass == "") {
          this.$message({
            type: "warning",
            message: "请输入密码"
          });
        } else {
          if (this.checked) {
            // 记住密码
            this.setCookie(this.ruleForm.name, this.ruleForm.pass, 30); // 保存期限为30天
          } else {
            this.clearCookie(); // 清空 Cookie
          }
          if (valid) {
            var _this = store;
            axios.userLogin(this.ruleForm).then(res => {
              //账号不存在
              if (res.data.info === false) {
                this.$message({
                  type: "error",
                  message: "账号不存在"
                });
                return;
              }
              //账号存在
              if (res.data.success) {
                this.$message({
                  type: "success",
                  message: "登录成功"
                });
                //拿到返回的token和username，并存到store
                let token = res.data.token;
                let username = res.data.username;
                _this.dispatch("UserLogin", token);
                _this.dispatch("UserName", username);
                //跳到目标页
                this.$router.push("layout");
              } else if (res.data.status == 300) {
                this.$message({
                  type: "warning",
                  message: "密码错误"
                });
              }
            });
          }
        }
      });
    }
  },
  mounted() {
    this.getCookie();
  }
};
</script>
<style>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
}
</style>
