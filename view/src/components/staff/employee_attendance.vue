<template>
  <div>
    <el-upload
      class="upload-demo"
      action="http://localhost:3000/api/saveData"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :on-success="handleAvatarSuccess"
      :show-file-list="false"
      :header="header"
      style="display:inline-block"
    >
      <el-button size="small" type="primary">导入</el-button>
    </el-upload>
    <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
    <el-table
      :data="attendance"
      highlight-current-row
      v-loading="listLoading"
      style="width: 100%;margin-top:20px"
      id="out-table"
    >
      <el-table-column prop="id" label="工号" width="60"></el-table-column>
      <el-table-column prop="name" label="姓名" width="80"></el-table-column>
      <el-table-column prop="1" label="1" width="60"></el-table-column>
      <el-table-column prop="2" label="2" width="57"></el-table-column>
      <el-table-column prop="3" label="3" width="57"></el-table-column>
      <el-table-column prop="4" label="4" width="57"></el-table-column>
      <el-table-column prop="5" label="5" width="57"></el-table-column>
      <el-table-column prop="6" label="6" width="57"></el-table-column>
      <el-table-column prop="7" label="7" width="57"></el-table-column>
      <el-table-column prop="8" label="8" width="57"></el-table-column>
      <el-table-column prop="9" label="9" width="57"></el-table-column>
      <el-table-column prop="10" label="10" width="57"></el-table-column>
      <el-table-column prop="11" label="11" width="57"></el-table-column>
      <el-table-column prop="12" label="12" width="57"></el-table-column>
      <el-table-column prop="13" label="13" width="57"></el-table-column>
      <el-table-column prop="14" label="14" width="57"></el-table-column>
      <el-table-column prop="15" label="15" width="57"></el-table-column>
      <el-table-column prop="16" label="16" width="57"></el-table-column>
      <el-table-column prop="17" label="17" width="57"></el-table-column>
      <el-table-column prop="18" label="18" width="57"></el-table-column>
      <el-table-column prop="19" label="19" width="57"></el-table-column>
      <el-table-column prop="20" label="20" width="57"></el-table-column>
      <el-table-column prop="21" label="21" width="57"></el-table-column>
      <el-table-column prop="22" label="22" width="57"></el-table-column>
      <el-table-column prop="23" label="23" width="57"></el-table-column>
      <el-table-column prop="24" label="24" width="57"></el-table-column>
      <el-table-column prop="25" label="25" width="57"></el-table-column>
      <el-table-column prop="26" label="26" width="57"></el-table-column>
      <el-table-column prop="27" label="27" width="57"></el-table-column>
      <el-table-column prop="28" label="28" width="57"></el-table-column>
      <el-table-column prop="29" label="29" width="57"></el-table-column>
      <el-table-column prop="30" label="30" width="57"></el-table-column>
      <el-table-column prop="31" label="31" width="57"></el-table-column>
      <el-table-column prop="late" label="本月迟到早退次数" width="120"></el-table-column>
      <el-table-column prop="absenteeism" label="旷工4小时以内次数" width="125"></el-table-column>
      <el-table-column prop="absenteeisms" label="旷工4到8小时次数" width="120"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from "moment";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import axios from "../../axios.js";
export default {
  data() {
    return {
      fileList: [],
      listLoading: true,
      attendance: [],
      year: 0,
      month: 0,
      days: 0,
      header: {
        name: ""
      },
      path: ""
    };
  },
  methods: {
    //定义导出Excel表格事件
    exportExcel() {
      axios
        .exportAttentant()
        .then(res => {
          if (res.data.code == 200) {
            this.download(res.data.result, "考勤表.xlsx");
          }
          // this.path = {
          //   path: res.data.result
          // };
        })
        .then(() => {
          axios.delAttentant().then(res => {});
        });
    },
    download(url, fileName) {
      let link = document.createElement("a"); //创建a标签
      link.style.display = "none"; //将a标签隐藏
      link.href = url; //给a标签添加下载链接
      link.setAttribute("download", fileName); // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
      document.body.appendChild(link);
      link.click(); //执行a标签
    },
    // exportExcel() {
    //   /* 从表生成工作簿对象 */
    //   var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
    //   /* 获取二进制字符串作为输出 */
    //   var wbout = XLSX.write(wb, {
    //     bookType: "xlsx",
    //     bookSST: true,
    //     type: "array"
    //   });
    //   try {
    //     FileSaver.saveAs(
    //       //Blob 对象表示一个不可变、原始数据的类文件对象。
    //       //Blob 表示的不一定是JavaScript原生格式的数据。
    //       //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
    //       //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
    //       new Blob([wbout], { type: "application/octet-stream" }),
    //       //设置导出文件名称
    //       `${this.year}-${this.month}考勤.xlsx`
    //     );
    //   } catch (e) {
    //     debugger;
    //     if (typeof console !== "undefined") console.log(e, wbout);
    //   }
    //   return wbout;
    // },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleAvatarSuccess(res, file, fileList) {
      this.attendance = res.data;
      this.listLoading = false;
      this.$message({
        type: "success",
        message: "导入成功"
      });
    }
  }
};
</script>

<style>
</style>