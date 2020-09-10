const Attendance = require('../db/db.js').Attendance;
const Staff = require('../db/db.js').Staff;
const Wage = require('../db/db.js').Wage;
const uploadExcelSrv = require('../service/uploadExcelSrv');
const mongoXlsx = require('mongo-xlsx');
const fs = require('fs')
const path = require('path')
const saveData = async function (ctx, next) {
  const getRes = await uploadExcelSrv.getExcelObjs(ctx);
  //得到的是数组
  const data = getRes.arr
  await Attendance.remove({})
  console.log('删除考勤成功');
  await Attendance.insertMany(data)
  console.log('插入考勤成功');
  ctx.body = {
    status: 200,
    msg: '上传数据成功',
    data: data
  };
  await uploadWage(data)
  await fs.unlinkSync('excel/考勤表.xlsx');
};

const uploadWage = async (data) => {
  for (var i = 0; i < data.length; i++) {
    let id = ('000000' + data[i].id).slice(-6);
    console.log(id);
    
    let Doc = await Staff.find({ id: id })
    console.log( Doc);
    
    let doc_id = Doc[0]._id
    let obj = await Attendance.find({ id: id })
    let doc = await Wage.find({ '_id': doc_id })
    let post_wage = doc[0].post_wage
    let basic_wage = doc[0].basic_wage
    if (obj != "") {
      //考勤扣款计算
      let num1 = obj[0].absenteeisms
      let num2 = obj[0].absenteeism
      let num3 = obj[0].late
      if (num3 > 0 || num2 > 0 || num1 > 0) {
        var deduction = ((post_wage + basic_wage) / 21.75 * num1 + num2 * (post_wage + basic_wage) / 21.75 / 2 + num3 * 100).toFixed(2)
        var reward = 0
      } else {
        var deduction = 0
        var reward = 100
      }
      //社保扣款
      let social_security = ((post_wage + basic_wage - deduction + reward) * 0.6 * 0.8).toFixed(2)
      //个人所得税
      let all = (post_wage + basic_wage - deduction + reward - social_security)
      let tax;
      if (all <= 5000) {
        tax = 0
      } else if (all > 5000 && all <= 36000) {
        tax = (all * 0.03).toFixed(2)
      } else if (all > 36000 && all <= 144000) {
        tax = (all * 0.1).toFixed(2)
      } else if (all > 144000 && all <= 300000) {
        tax = (all * 0.2).toFixed(2)
      } else if (all > 300000 && all <= 420000) {
        tax = (all * 0.25).toFixed(2)
      } else if (all > 420000 && all <= 660000) {
        tax = (all * 0.3).toFixed(2)
      } else if (all > 660000 && all <= 960000) {
        tax = (all * 0.35).toFixed(2)
      } else if (all > 960000) {
        tax = (all * 0.45).toFixed(2)
      }
      let wage = (post_wage + basic_wage - deduction + reward - social_security - tax).toFixed(2)
      doc[0].deduction = deduction
      doc[0].reward = reward
      doc[0].social_security = social_security
      doc[0].tax = tax
      doc[0].wage = wage
      let excel_wage = new Wage(doc[0])
      await  excel_wage.save();
    }

  }
}
module.exports = {
  saveData
};
