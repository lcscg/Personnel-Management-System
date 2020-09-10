<template>
  <div>
    <el-row>
      <el-col :span="11">
        <el-card shadow="always">
          <el-form :model="add_department" :rules="addFormRules" ref="add_department" size="medium">
            <el-row :gutter="20">
              <el-form-item style="text-align:center">
                <div style="font-size:1.5rem">添加部门</div>
              </el-form-item>
              <el-form-item label="部门" prop="id" label-width="80px">
                <el-input
                  v-model.trim="add_department.depart"
                  auto-complete="off"
                  placeholder="请输入部门"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="部门职能" prop="id" label-width="80px">
                <el-input
                  v-model.trim="add_department.department_function"
                  auto-complete="off"
                  placeholder="请输入部门职能"
                  type="textarea"
                  clearable
                ></el-input>
              </el-form-item>
            </el-row>
            <el-form-item style="text-align:center">
              <el-button
                type="primary"
                @click.native="add_depart('add_department')"
                :loading="addLoading"
                size="medium"
              >提 交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="11" style="margin-left:5rem">
        <el-card>
          <el-form :model="add_position" :rules="addFormRules" ref="add_position" size="medium">
            <el-row :gutter="20">
              <el-form-item style="text-align:center">
                <div style="font-size:1.5rem">添加职位</div>
              </el-form-item>
              <el-form-item label="部门" prop="id" label-width="80px">
                <el-select v-model="add_position.department" placeholder="请选择">
                  <el-option
                    v-for="item in departments"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                    clearable
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="岗位" prop="id" label-width="80px">
                <el-input
                  v-model.trim="add_position.position"
                  auto-complete="off"
                  placeholder="请输入岗位"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="岗位工资" prop="id" label-width="80px">
                <el-input
                  v-model.trim="add_position.post_wage"
                  auto-complete="off"
                  placeholder="请输入岗位工资"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="职位职能" prop="id" label-width="80px">
                <el-input
                  v-model.trim="add_position.position_function"
                  auto-complete="off"
                  placeholder="请输入职位职能"
                  type="textarea"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="职位要求" prop="id" label-width="80px">
                <el-input
                  v-model.trim="add_position.claim"
                  auto-complete="off"
                  placeholder="请输入职位要求"
                  type="textarea"
                  clearable
                ></el-input>
              </el-form-item>
            </el-row>
            <el-form-item style="text-align:center">
              <!-- <div slot="footer" class="dialog-footer" style="text-align:center"> -->
              <el-button
                type="primary"
                @click.native="addPosition('add_position')"
                :loading="addLoading"
                size="medium"
              >提 交</el-button>
              <!-- </div> -->
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "../../axios.js";
export default {
  data() {
    return {
      departments: [],
      addLoading: false,
      add_position: {
        department: "",
        position: "",
        position_function: "",
        post_wage: "",
        claim: ""
      },
      add_department: {
        depart: "",
        department_function: ""
      },
      addFormRules: {}
    };
  },
  methods: {
    addPosition(add_position) {
      var _this = this;
      this.$refs[add_position].validate(valid => {
        if (valid) {
          if (
            _this.add_position.department != "" &&
            _this.add_position.position != "" &&
            _this.add_position.position_function != "" &&
            _this.add_position.post_wage != "" &&
            _this.add_position.claim != ""
          ) {
            axios.addPosition(this.add_position).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
                _this.add_position.department = "";
                _this.add_position.position = "";
                _this.add_position.position_function = "";
                _this.add_position.post_wage = "";
                _this.add_position.claim = "";
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.msg
                });
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: "信息不完整"
            });
          }
        }
      });
    },
    add_depart(add_department) {
      var _this = this;
      this.$refs[add_department].validate(valid => {
        if (valid) {
          if (
            _this.add_department.depart != "" &&
            _this.add_department.department_function != ""
          ) {
            console.log(this.add_department);
            axios.addDepartment(this.add_department).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
                _this.add_department.depart = "";
                _this.add_department.department_function = "";
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.msg
                });
              }
              _this.getDepartment();
            });
          } else {
            this.$message({
              type: "warning",
              message: "信息不完整"
            });
          }
        }
      });
    },
    //获取部门
    getDepartment() {
      var _this = this;
      this.departments = [];
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
  }
};
</script>

<style>
</style>