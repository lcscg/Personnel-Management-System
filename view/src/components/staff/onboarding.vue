<template>
  <div>
    <el-card shadow="always">
      <el-form
        :model="addForm"
        label-width="130px"
        :rules="addFormRules"
        ref="addForm"
        :label-position="'right'"
        size="medium"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="工号" prop="id">
              <el-input
                v-model.trim="addForm.id"
                auto-complete="off"
                placeholder="工号会自动生成"
                clearable
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left:20%">
            <el-form-item label="姓名" prop="name">
              <el-input v-model.trim="addForm.name" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="addForm.sex">
                <el-radio class="radio" :label="0">男</el-radio>
                <el-radio class="radio" :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄" prop="age" style="margin-left:65%">
              <el-input-number v-model="addForm.age" :min="18" :max="65"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="手机号码" prop="phone" clearable>
              <el-input
                v-model.trim="addForm.phone"
                auto-complete="off"
                minlength="11"
                maxlength="11"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left:20%">
            <el-form-item label="邮箱" prop="mail">
              <el-input v-model.trim="addForm.mail" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="户籍所在地" prop="birth_addr" clearable>
              <el-input v-model.trim="addForm.birth_addr" auto-complete="off" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left:20%">
            <el-form-item label="学历" prop="education">
              <el-select v-model.trim="addForm.education" placeholder="请选择">
                <el-option
                  v-for="item in educations"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="紧急联系人" prop="contact">
              <el-input
                v-model.trim="addForm.contact"
                auto-complete="off"
                show-word-limit
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left:20%">
            <el-form-item label="紧急联系人电话" prop="contact_phone">
              <el-input
                v-model.trim="addForm.contact_phone"
                auto-complete="off"
                minlength="11"
                maxlength="11"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="紧急联系人关系" prop="contact_relationship">
              <el-input
                v-model.trim="addForm.contact_relationship"
                auto-complete="off"
                show-word-limit
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left:20%">
            <el-form-item label="婚姻状况" prop="marriage">
              <el-select v-model.trim="addForm.marriage" placeholder="请选择">
                <el-option label="未婚" value="未婚"></el-option>
                <el-option label="已婚" value="已婚"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="所属部门" prop="department">
              <el-select
                v-model.trim="addForm.department"
                @change="getPositions($event)"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in departments"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left:20%">
            <el-form-item label="职位" prop="job">
              <el-select v-model.trim="addForm.job" placeholder="请选择">
                <el-option
                  v-for="item in positions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="addForm.status" placeholder="请选择" disabled>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left:20%">
            <el-form-item label="入职时间" prop="create_time">
              <el-date-picker
                v-model="addForm.create_time"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="基本工资" prop="basic_wage">
              <el-input v-model.trim="addForm.basic_wage" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left:20%">
            <el-form-item label="岗位工资" prop="post_wage">
              <el-input v-model.trim="addForm.post_wage" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row :gutter="20">
          <el-col :span="21">
            <el-form-item label="现住地址" prop="addr">
              <el-input v-model.trim="addForm.addr" type="textarea" :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item style="text-align:center">
              <el-button size="medium" @click.native="clear()">重 置</el-button>
              <el-button
                type="primary"
                @click.native="addSubmit('addForm')"
                :loading="addLoading"
                size="medium"
              >提 交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from "../../axios.js";
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "在职"
        },
        {
          value: "选项2",
          label: "离职"
        }
      ],
      educations: [
        {
          value: "大专",
          label: "大专"
        },
        {
          value: "本科",
          label: "本科"
        },
        {
          value: "硕士",
          label: "硕士"
        },
        {
          value: "博士",
          label: "博士"
        }
      ],
      positions: [],
      departments: [],
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        // id: [{ required: true, message: "请输入工号", trigger: "blur" }],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        job: [{ required: true, message: "请输入岗位", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
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
        birth_addr: [
          { required: true, message: "请输入户籍所在地", trigger: "blur" }
        ],
        education: [
          { required: true, message: "请选择学历", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "请输入紧急联系人", trigger: "blur" }
        ],
        contact_phone: [
          { required: true, message: "请输入紧急联系人电话", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
            message: "请输入正确的手机号码"
          }
        ],
        contact_relationship: [
          { required: true, message: "请输入与紧急联系人关系", trigger: "blur" }
        ],
        marriage: [
          { required: true, message: "请选择婚姻状况", trigger: "blur" }
        ],
        create_time: [
          { required: true, message: "请选择入职时间", trigger: "blur" }
        ],
        department: [
          { required: true, message: "请选择所属部门", trigger: "blur" }
        ],
        addr: [{ required: true, message: "请输入现住地址", trigger: "blur" }]
      },
      addForm: {
        id: "",
        name: "",
        sex: 0,
        age: 0,
        addr: "",
        phone: "",
        mail: "",
        job: "",
        status: "在职",
        department: "",
        birth_addr: "",
        education: "",
        contact: "",
        contact_phone: "",
        contact_relationship: "",
        marriage: "",
        create_time: ""
      }
    };
  },
  methods: {
    clear() {
      this.addForm.id = "";
      this.addForm.name = "";
      this.addForm.job = "";
      this.addForm.sex = 0;
      this.addForm.age = 18;
      this.addForm.addr = "";
      this.addForm.phone = "";
      this.addForm.mail = "";
      this.addForm.status = "在职";
      this.addForm.department = "";
      this.addForm.birth_addr = "";
      this.addForm.education = "";
      this.addForm.contact = "";
      this.addForm.contact_phone = "";
      this.addForm.contact_relationship = "";
      this.addForm.marriage = "";
      this.addForm.create_time = "";
    },
    addSubmit(addForm) {
      var _this = this;
      this.$refs[addForm].validate(valid => {
        if (valid) {
          // console.log(this.addForm);
          axios.addStaff(this.addForm).then(res => {
            // console.log(res);
            if (res.data.success == true) {
              _this.$message({
                type: "success",
                message: "提交成功"
              });
              _this.clear();
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
    },
    //获取部门职位
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
      this.addForm.job = "";
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
  }
};
</script>

<style>
</style>