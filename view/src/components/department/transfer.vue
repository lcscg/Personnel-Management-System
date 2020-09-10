<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="工号">
          <el-input v-model.trim="filters.id" placeholder="请输入工号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="FindTransfer(1)">查询</el-button>
          <el-button type="primary" v-on:click="clear()">重置</el-button>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="transfer" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="id" label="工号" width="120"></el-table-column>
      <el-table-column prop="front_department" label="调前部门" width="150"></el-table-column>
      <el-table-column prop="front_position" label="调前职位" width="150"></el-table-column>
      <el-table-column prop="after_department" label="调后部门" width="150"></el-table-column>
      <el-table-column prop="after_position" label="调后职位" width="180"></el-table-column>
      <el-table-column prop="adjustment_data" label="调职时间" width="180" :formatter="formatter"></el-table-column>
      <el-table-column prop="remark" label="调职原因" width="180"></el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
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
    <el-dialog title="修改信息" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="Form" label-width="80px" :rules="FormRules" ref="editForm">
        <el-form-item label="工号" prop="id">
          <el-input v-model.trim="Form.id" auto-complete="off" placeholder="请输入工号" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="调前部门" prop="front_department">
          <el-select
            v-model="Form.front_department"
            placeholder="请选择"
            @change="getPositions($event,1)"
            disabled
          >
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调前职位" prop="front_position">
          <el-select v-model.trim="Form.front_position" placeholder="请选择" disabled>
            <el-option
              v-for="item in positions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调后部门" prop="after_department">
          <el-select
            v-model="Form.after_department"
            placeholder="请选择"
            @change="getPositions($event,2)"
          >
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调后职位" prop="after_position">
          <el-select v-model.trim="Form.after_position" placeholder="请选择">
            <el-option
              v-for="item in positions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调职时间" prop="after_position">
          <el-date-picker
            v-model="Form.adjustment_data"
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="调职原因" prop="remark">
          <el-input v-model.trim="Form.remark" auto-complete="off" placeholder="请输入调职原因" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--新增界面-->
    <el-dialog title="添加调职" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="Form" label-width="80px" :rules="FormRules" ref="Form">
        <el-form-item label="工号" prop="id">
          <el-input v-model.trim="Form.id" auto-complete="off" placeholder="请输入工号" @change="getjob"></el-input>
        </el-form-item>
        <el-form-item label="调前部门" prop="front_department">
          <el-select
            v-model="Form.front_department"
            placeholder="请选择"
            @change="getPositions($event,1)"
            disabled="true"
          >
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调前职位" prop="front_position">
          <el-select v-model="Form.front_position" placeholder="请选择" disabled="true">
            <el-option
              v-for="item in positions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调后部门" prop="after_department">
          <el-select
            v-model="Form.after_department"
            placeholder="请选择"
            @change="getPositions($event,2)"
          >
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调后职位" prop="after_position">
          <el-select v-model="Form.after_position" placeholder="请选择">
            <el-option
              v-for="item in positions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调职时间" prop="after_position">
          <el-date-picker
            v-model="Form.adjustment_data"
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="调职原因" prop="remark">
          <el-input v-model.trim="Form.remark" auto-complete="off" placeholder="请输入调职原因" clearable></el-input>
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
import moment from "moment";
export default {
  data() {
    return {
      filters: {
        name: "",
        id: ""
      },
      departments: [],
      transfer: [],
      positions: [],
      total: 0,
      page: 1,
      pageNum: 1,
      listLoading: true,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      FormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            pattern: /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\.·。]{0,8}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,8}[a-zA-Z]{1}$)/,
            message: "请输入正确的姓名"
          }
        ],
        id: [{ required: true, message: "请输入id", trigger: "blur" }],
        front_department: [
          { required: true, message: "请选择调前部门", trigger: "change" }
        ],
        after_department: [
          { required: true, message: "请选择调后部门", trigger: "change" }
        ],
        front_position: [
          { required: true, message: "请输入调前职位", trigger: "blur" }
        ],
        after_position: [
          { required: true, message: "请输入调后职位", trigger: "blur" }
        ],
        adjustment_data: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        remark: [{ required: true, message: "请输入调职原因", trigger: "blur" }]
      },
      //编辑界面数据
      Form: {
        id: "",
        front_department: "",
        front_position: "",
        after_department: "",
        after_position: "",
        remark: "",
        adjustment_data: ""
        // power: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      dialogVisible: true
    };
  },
  methods: {
    getjob(val) {
      this.Form.front_department = "";
      this.Form.front_position = "";
      let req = { id: val };
      axios.findjob(req).then(res => {
        if (res.data.code === 200) {
          this.Form.front_department = res.data.department;
          this.Form.front_position = res.data.position;
        } else {
          this.$message({
            message: "工号不存在",
            type: "error"
          });
        }
      });
    },
    formatter(row, col) {
      return moment(row.adjustment_data).format("YYYY-MM-DD");
    },
    // 改变时
    handleSizeChange(val) {
      this.pageSize = val;
      this.getdata();
    },
    //条目改变时
    handleCurrentChange(val) {
      this.pageNum = val;
      if (this.filters.id == "") this.getdata();
      else this.FindTransfer(2);
    },
    FindTransfer(num) {
      var number;
      num == 1 ? (number = 1) : (number = this.pageNum);
      var _this = this;
      var params = {
        id: _this.filters.id,
        pageNum: number
      };
      axios.findTransfer(params).then(res => {
        _this.transfer = res.data.result;
        _this.total = res.data.size;
        // res.data.length == undefined
        //   ? (_this.transfer = [res.data])
        //   : (_this.transfer = res.data);
      });
    },
    //重置搜索栏
    clear() {
      // this.filters.id = "";
      this.filters.name = "";
      this.filters.id = "";
      this.getdata();
    },
    getdata() {
      let para = {
        pageNum: this.pageNum
      };
      var _this = this;
      axios.pageTransfer(para.pageNum).then(res => {
        console.log(res);

        if (res.status == 200) {
          _this.transfer = res.data.result;
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
    handleEdit: function(index, row) {
      console.log(row);
      this.editFormVisible = true;
      this.Form = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.Form = {
        id: "",
        front_department: "",
        front_position: "",
        after_department: "",
        after_position: "",
        remark: "",
        adjustment_data: ""
      };
    },
    editSubmit(Form) {
      var _this = this;
      this.$refs[Form].validate(valid => {
        if (valid) {
          axios.updateTransfer(_this.Form).then(res => {
            if (res.status == 200) {
              _this.$message({
                type: "success",
                message: "修改成功"
              });
              this.getdata();
              _this.editFormVisible = false;
            } else {
              _this.$message({
                type: "error",
                message: "修改失败"
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
      axios.delTransfer({ id: col._id }).then(res => {
        console.log(res);
        if (res.status == 200) {
          _this.$message({
            type: "success",
            message: "删除成功"
          });
          _this.transfer.splice(row, 1);
          this.getdata();
        } else {
          _this.$message({
            type: "error",
            message: "删除失败"
          });
        }
      });
    },
    addSubmit(Form) {
      var _this = this;
      this.$refs[Form].validate(valid => {
        if (valid) {
          axios.addTransfer(_this.Form).then(res => {
            console.log(res);
            if (res.status == 200) {
              _this.$message({
                type: "success",
                message: "添加成功"
              });
              _this.addFormVisible = false;
              this.getdata();
            } else {
              _this.$message({
                type: "error",
                message: res.data.msg
              });
              _this.addFormVisible = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    getPositions(event, num) {
      var _this = this;
      num == 1
        ? (_this.Form.front_position = "")
        : (_this.Form.after_position = "");
      _this.positions = [];
      axios.findPosition({ department: event }).then(res => {
        let obj = res.data.result;
        obj.forEach((arr, index) => {
          _this.positions.push({ value: arr.position });
        });
      });
    }
  },
  created() {
    this.getdata();
  },
  mounted() {
    this.getDepartment();
  }
};
</script>
<style scoped>
</style>
